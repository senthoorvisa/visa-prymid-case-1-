begin;
create extension if not exists pgtap;
select plan(5);

insert into public.films (id, title) values
  ('10000000-0000-4000-8000-000000000001', 'Eligibility test active film'),
  ('10000000-0000-4000-8000-000000000002', 'Eligibility test expired film')
on conflict (id) do nothing;
insert into public.songs (id, film_id, title) values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Eligibility test active song'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'Eligibility test expired song')
on conflict (id) do nothing;
insert into public.rights (id, film_id, owner, territory, start_date, license_period_months)
values
  ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Test owner', 'TEST-ELIGIBLE', current_date - 20, 12),
  ('30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'Test owner', 'TEST-EXPIRED', current_date - 900, 1)
on conflict (id) do update set start_date = excluded.start_date;

select is(
  (select eligible from public.compilation_eligibility_view where song_id = '20000000-0000-4000-8000-000000000001' and territory = 'TEST-ELIGIBLE'),
  true,
  'a song with current territory rights and no recent use is eligible'
);
select is(
  (select eligible from public.compilation_eligibility_view where song_id = '20000000-0000-4000-8000-000000000002' and territory = 'TEST-EXPIRED'),
  false,
  'an expired territory right blocks eligibility'
);
select like(
  (select reason from public.compilation_eligibility_view where song_id = '20000000-0000-4000-8000-000000000002' and territory = 'TEST-EXPIRED'),
  'Rights expired on %',
  'the view explains the expired-rights reason'
);
select is(
  (select eligible from public.compilation_eligibility_view where song_id = '20000000-0000-4000-8000-000000000002' and territory = 'TEST-ELIGIBLE'),
  false,
  'a song without rights for the chosen territory is not eligible'
);

insert into public.compilations (id, name, territory)
values ('40000000-0000-4000-8000-000000000001', 'Eligibility cooldown', 'TEST-ELIGIBLE')
on conflict (id) do nothing;
insert into public.compilation_items (id, compilation_id, song_id, added_at)
values ('50000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', now() - interval '15 days')
on conflict (id) do update set added_at = excluded.added_at;
select is(
  (select eligible from public.compilation_eligibility_view where song_id = '20000000-0000-4000-8000-000000000001' and territory = 'TEST-ELIGIBLE'),
  false,
  'a recently used song is blocked during the reuse cooldown'
);

select * from finish();
rollback;
