create extension if not exists pgcrypto;

do $$ begin
  create type public.profile_role as enum ('admin', 'editor', 'viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.rights_status as enum ('active', 'expiring_soon', 'expired', 'perpetual');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role public.profile_role not null default 'viewer',
  created_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id boolean primary key default true check (id),
  expiring_soon_days integer not null default 90 check (expiring_soon_days > 0),
  song_reuse_cooldown_days integer not null default 180 check (song_reuse_cooldown_days >= 0),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

insert into public.app_settings (id, expiring_soon_days, song_reuse_cooldown_days)
values (true, 90, 180) on conflict (id) do nothing;

create table if not exists public.films (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  release_year integer check (release_year between 1888 and 2200),
  language text,
  genre text,
  synopsis text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint films_title_unique unique (title)
);

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  film_id uuid not null references public.films(id) on delete restrict,
  title text not null,
  singer text,
  language text,
  genre text,
  year integer check (year between 1800 and 2200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint songs_title_film_unique unique (title, film_id)
);

create table if not exists public.rights (
  id uuid primary key default gen_random_uuid(),
  film_id uuid not null references public.films(id) on delete restrict,
  owner text not null,
  territory text not null,
  start_date date not null,
  license_period_months integer check (license_period_months > 0),
  is_perpetual boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rights_period_required check (is_perpetual or license_period_months is not null),
  constraint rights_film_owner_territory_start_unique unique (film_id, owner, territory, start_date)
);

create table if not exists public.compilations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  territory text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.compilation_items (
  id uuid primary key default gen_random_uuid(),
  compilation_id uuid not null references public.compilations(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete restrict,
  added_at timestamptz not null default now(),
  added_by uuid references public.profiles(id) on delete set null,
  constraint compilation_song_once unique (compilation_id, song_id)
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id text not null,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  old_data jsonb,
  new_data jsonb,
  changed_by uuid references public.profiles(id) on delete set null,
  changed_at timestamptz not null default now()
);

create index if not exists songs_film_id_idx on public.songs (film_id);
create index if not exists rights_film_territory_idx on public.rights (film_id, territory);
create index if not exists compilation_items_song_added_idx on public.compilation_items (song_id, added_at desc);
create index if not exists compilation_items_compilation_idx on public.compilation_items (compilation_id);
create index if not exists audit_log_changed_at_idx on public.audit_log (changed_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists films_set_updated_at on public.films;
create trigger films_set_updated_at before update on public.films for each row execute function public.set_updated_at();
drop trigger if exists songs_set_updated_at on public.songs;
create trigger songs_set_updated_at before update on public.songs for each row execute function public.set_updated_at();
drop trigger if exists rights_set_updated_at on public.rights;
create trigger rights_set_updated_at before update on public.rights for each row execute function public.set_updated_at();
drop trigger if exists settings_set_updated_at on public.app_settings;
create trigger settings_set_updated_at before update on public.app_settings for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert or update on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_user_role()
returns public.profile_role language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = (select auth.uid())
$$;

create or replace view public.rights_status_view with (security_invoker = true) as
select
  r.id,
  r.film_id,
  f.title as film_title,
  r.owner,
  r.territory,
  r.start_date,
  r.license_period_months,
  r.is_perpetual,
  case when r.is_perpetual then null::date
    else (r.start_date + make_interval(months => r.license_period_months) - interval '1 day')::date
  end as expiry_date,
  case
    when r.is_perpetual then 'perpetual'::public.rights_status
    when (r.start_date + make_interval(months => r.license_period_months) - interval '1 day')::date < current_date then 'expired'::public.rights_status
    when (r.start_date + make_interval(months => r.license_period_months) - interval '1 day')::date <= current_date + coalesce(s.expiring_soon_days, 90) then 'expiring_soon'::public.rights_status
    else 'active'::public.rights_status
  end as status
from public.rights r
join public.films f on f.id = r.film_id
left join public.app_settings s on s.id = true;

create or replace view public.compilation_eligibility_view with (security_invoker = true) as
with territories as (
  select distinct territory from public.rights
), recent_uses as (
  select distinct on (ci.song_id)
    ci.song_id,
    ci.added_at,
    c.name as compilation_name
  from public.compilation_items ci
  join public.compilations c on c.id = ci.compilation_id
  order by ci.song_id, ci.added_at desc
)
select
  s.id as song_id,
  s.title as song_title,
  s.film_id,
  f.title as film_title,
  s.singer,
  s.language,
  s.genre,
  s.year,
  t.territory,
  coalesce(rs.status in ('active', 'expiring_soon', 'perpetual') and
    (ru.added_at is null or ru.added_at::date <= current_date - coalesce(cfg.song_reuse_cooldown_days, 180)), false) as eligible,
  case
    when rs.id is null then 'No rights for this territory'
    when rs.status = 'expired' then 'Rights expired on ' || to_char(rs.expiry_date, 'Mon DD, YYYY')
    when rs.status is null then 'No rights for this territory'
    when ru.added_at is not null and ru.added_at::date > current_date - coalesce(cfg.song_reuse_cooldown_days, 180)
      then 'Used in ' || ru.compilation_name || ' ' || (current_date - ru.added_at::date)::text || ' days ago'
    else 'Eligible'
  end as reason,
  ru.added_at as last_used_at,
  rs.expiry_date as rights_expiry_date,
  rs.status as rights_status
from public.songs s
left join public.films f on f.id = s.film_id
cross join territories t
left join lateral (
  select rsv.id, rsv.status, rsv.expiry_date
  from public.rights_status_view rsv
  where rsv.film_id = s.film_id and rsv.territory = t.territory
  order by case rsv.status when 'perpetual' then 1 when 'active' then 2 when 'expiring_soon' then 3 else 4 end,
    rsv.expiry_date desc nulls first
  limit 1
) rs on true
left join recent_uses ru on ru.song_id = s.id
left join public.app_settings cfg on cfg.id = true;

create or replace function public.save_compilation(p_name text, p_territory text, p_song_ids uuid[])
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  new_compilation_id uuid;
  requested_count integer;
  eligible_count integer;
begin
  if (select auth.uid()) is null then
    raise exception 'Sign in before saving a compilation' using errcode = '42501';
  end if;
  if public.current_user_role() not in ('admin', 'editor') then
    raise exception 'Only editors and admins can save compilations' using errcode = '42501';
  end if;
  if nullif(trim(p_name), '') is null or nullif(trim(p_territory), '') is null then
    raise exception 'A compilation name and territory are required' using errcode = '22023';
  end if;
  select count(distinct song_id) into requested_count from unnest(coalesce(p_song_ids, '{}'::uuid[])) as selected(song_id);
  if requested_count = 0 then
    raise exception 'Select at least one song' using errcode = '22023';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(selected.song_id::text, 0))
  from (select distinct unnest(p_song_ids) as song_id order by song_id) selected;
  select count(*) into eligible_count
  from public.compilation_eligibility_view e
  where e.territory = p_territory and e.song_id = any(p_song_ids) and e.eligible;
  if eligible_count <> requested_count then
    raise exception 'One or more songs are no longer eligible for this territory' using errcode = '23514';
  end if;

  insert into public.compilations (name, territory, created_by)
  values (trim(p_name), trim(p_territory), (select auth.uid())) returning id into new_compilation_id;
  insert into public.compilation_items (compilation_id, song_id, added_by)
  select new_compilation_id, selected.song_id, (select auth.uid())
  from (select distinct unnest(p_song_ids) as song_id) selected;
  return new_compilation_id;
end;
$$;

create or replace function public.write_audit_log()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  previous_data jsonb;
  current_data jsonb;
  record_key text;
begin
  if tg_op = 'INSERT' then
    current_data := to_jsonb(new);
    record_key := current_data ->> 'id';
  elsif tg_op = 'UPDATE' then
    previous_data := to_jsonb(old);
    current_data := to_jsonb(new);
    record_key := current_data ->> 'id';
  else
    previous_data := to_jsonb(old);
    record_key := previous_data ->> 'id';
  end if;
  insert into public.audit_log (table_name, record_id, action, old_data, new_data, changed_by)
  values (tg_table_name, record_key, tg_op, previous_data, current_data, (select auth.uid()));
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array['films', 'songs', 'rights', 'compilations', 'compilation_items', 'app_settings'] loop
    execute format('drop trigger if exists audit_%I on public.%I', table_name, table_name);
    execute format('create trigger audit_%I after insert or update or delete on public.%I for each row execute function public.write_audit_log()', table_name, table_name);
  end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.app_settings enable row level security;
alter table public.films enable row level security;
alter table public.songs enable row level security;
alter table public.rights enable row level security;
alter table public.compilations enable row level security;
alter table public.compilation_items enable row level security;
alter table public.audit_log enable row level security;

drop policy if exists "Authenticated users can read profiles" on public.profiles;
create policy "Authenticated users can read profiles" on public.profiles for select to authenticated using (true);
drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles" on public.profiles for update to authenticated using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

drop policy if exists "Authenticated users can read app settings" on public.app_settings;
create policy "Authenticated users can read app settings" on public.app_settings for select to authenticated using (true);
drop policy if exists "Admins manage app settings" on public.app_settings;
create policy "Admins manage app settings" on public.app_settings for all to authenticated using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

do $$
declare table_name text;
begin
  foreach table_name in array array['films', 'songs', 'rights', 'compilations', 'compilation_items'] loop
    execute format('drop policy if exists "Authenticated users can read %1$s" on public.%1$I', table_name);
    execute format('create policy "Authenticated users can read %1$s" on public.%1$I for select to authenticated using (true)', table_name);
    execute format('drop policy if exists "Editors and admins can write %1$s" on public.%1$I', table_name);
    execute format('create policy "Editors and admins can write %1$s" on public.%1$I for all to authenticated using (public.current_user_role() in (''admin'', ''editor'')) with check (public.current_user_role() in (''admin'', ''editor''))', table_name);
  end loop;
end $$;

drop policy if exists "Authenticated users can read audit history" on public.audit_log;
create policy "Authenticated users can read audit history" on public.audit_log for select to authenticated using (true);

grant usage on schema public to authenticated;
grant usage on type public.profile_role, public.rights_status to authenticated;
grant select, insert, update, delete on public.films, public.songs, public.rights, public.compilations, public.compilation_items to authenticated;
grant select on public.profiles, public.app_settings, public.audit_log to authenticated;
grant insert, update, delete on public.profiles, public.app_settings to authenticated;
grant select on public.rights_status_view, public.compilation_eligibility_view to authenticated;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.save_compilation(text, text, uuid[]) to authenticated;

comment on column public.rights.license_period_months is 'License duration in whole calendar months. Computed expiry is start_date + duration - 1 day; null only for perpetual rights.';
