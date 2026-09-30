# Pyramid Rights Workspace

Pyramid is a Next.js workspace for tracking film and song catalogues, rights by territory, compilation use, and reuse eligibility. The sample runs without a backend and keeps its demo sign-in only in memory. When configured, Supabase Auth and Postgres are the only persistent data store. Glass styling is CSS blur on navigation chrome, summary cards, and dialogs; catalogue and ledger rows remain plain for fast scrolling.

## Run locally

Requirements: Node.js 20.9 or later.

```powershell
npm install
Copy-Item .env.example .env.local
```

Start the app in blank sample mode:

```powershell
npm run dev
```

Open <http://localhost:3000>. Select **Continue as guest** or enter any email and password (including empty values) and select **Sign in to sample**. Demo sign-in is in memory and resets when the page is refreshed. The workspace intentionally contains no sample records, makes no Supabase requests, and saves no data.

To enable Supabase later, add both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to `.env.local`, apply the migration below, and restart the dev server. If either value is blank, the app remains in sample mode.

## Supabase setup

1. Create a Supabase project and copy the Project URL and publishable key from the project's **Connect** dialog into `.env.local`.
2. In the Supabase dashboard, open **SQL Editor → New query**, paste the contents of [`supabase/migrations/202609300001_initial_schema.sql`](supabase/migrations/202609300001_initial_schema.sql), and run it.
3. In **Authentication → Users**, create the first user. Then run this once in SQL Editor, replacing the email:

   ```sql
   update public.profiles set role = 'admin' where email = 'admin@example.com';
   ```

4. Create any additional users in Supabase Auth. The database trigger creates a `viewer` profile for each user. An admin can change an existing user's role in **Team & audit**.
5. Restart `npm run dev` after editing `.env.local` and sign in with the email and password for a Supabase Auth user.

After applying migrations, regenerate the app's schema types from your project with:

```powershell
npx supabase gen types typescript --project-id your-project-ref --schema public | Set-Content -Encoding utf8 src/types/database.ts
```

All signed-in users can read shared catalogue, rights, compilation, settings, and audit records. Editors and admins can change catalogue, rights, and compilation records. Admins can change roles and workspace settings. The app uses only the public publishable key; do not put a secret key in the browser.

## Rights and compilation rules

- Rights status is computed in `rights_status_view` from the license dates and `app_settings.expiring_soon_days`. `perpetual` rights have no expiry date.
- A non-perpetual license expires on the day before `start_date + license_period_months` calendar months. The default expiring-soon window is 90 days.
- `compilation_eligibility_view` checks the selected territory, current rights, and the global last-use date against the configurable 180-day song cooldown. It returns the reason a song is ineligible.
- `save_compilation` validates selected song IDs again in one database transaction before inserting a compilation and its usage rows.
- Database triggers record edits to films, songs, rights, compilations, usage rows, and settings in `audit_log`.

Eligibility SQL checks are in `supabase/tests/compilation_eligibility.test.sql`. Run them against a local Supabase stack with the Supabase CLI and pgTAP enabled:

```powershell
supabase start
supabase test db
```

## Excel catalogue import

From **Catalogue → Import workbook**, choose a sheet and map it as films or songs. The importer reads the workbook in memory, previews rows, skips entries with a missing title, and upserts after confirmation. Header names are matched case-insensitively after spaces and hyphens are converted to underscores. Recognized columns:

- Films: `title`, `release_year`, `language`, `genre`, `synopsis`
- Songs: `title`, `film` (required matching film title), `singer`, `language`, `genre`, `year`
- Rights: `title` (film title), `owner`, `territory`, `start_date`, `license_period_months`, `is_perpetual`

The workbook referenced in the project brief was not present in this workspace, so these mappings are a starting point; inspect and map its actual sheets and column names before importing production data. For rights imports, matching films must already exist in the catalogue.

## Production notes

### Deploy to Vercel

1. Push this project to a Git repository and import it in Vercel with **Add New → Project**. Vercel detects the Next.js framework and uses its standard build settings.
2. In **Project Settings → Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for Production (and Preview if you use preview deployments), then redeploy.
3. In Supabase **Authentication → URL Configuration**, set **Site URL** to your deployed production domain. Add `http://localhost:3000/**` for local use, and the Vercel preview pattern `https://*-<team-or-account-slug>.vercel.app/**` if preview deployments need Auth redirects. Prefer the exact production domain for production redirects.

See [Vercel's Next.js deployment guide](https://vercel.com/docs/frameworks/full-stack/nextjs), [Vercel environment variable docs](https://vercel.com/docs/environment-variables), and [Supabase Auth redirect URL docs](https://supabase.com/docs/guides/auth/redirect-urls) for current dashboard details. User invitations should be sent through Supabase Auth Dashboard or a server-side/Edge Function using a secret key; no admin secret is exposed by this client app.

## Commands

```powershell
npm run dev
npm run typecheck
npm run lint
npm run build
npm start
```
