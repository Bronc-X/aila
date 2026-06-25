-- Stage 1: enable RLS for AILA lead/profile tables without breaking
-- the existing public form submit path.
--
-- This removes anonymous read/update/delete access. It intentionally keeps
-- insert-only access for anon/authenticated clients so older deployed code
-- can still submit forms if the Vercel production build has not picked up
-- the server-only Supabase writer yet.

alter table public.registrations enable row level security;
alter table public.user_profiles enable row level security;

revoke all on table public.registrations from anon, authenticated;
revoke all on table public.user_profiles from anon, authenticated;

grant insert on table public.registrations to anon, authenticated;
grant insert on table public.user_profiles to anon, authenticated;

drop policy if exists "Allow anonymous inserts" on public.registrations;
drop policy if exists "Allow anonymous inserts" on public.user_profiles;
drop policy if exists "registrations public insert" on public.registrations;
drop policy if exists "registrations public read" on public.registrations;
drop policy if exists "registrations public update" on public.registrations;
drop policy if exists "registrations public delete" on public.registrations;
drop policy if exists "user profiles public insert" on public.user_profiles;
drop policy if exists "user profiles public read" on public.user_profiles;
drop policy if exists "user profiles public update" on public.user_profiles;
drop policy if exists "user profiles public delete" on public.user_profiles;

create policy "registrations public insert"
on public.registrations
for insert
to anon, authenticated
with check (true);

create policy "user profiles public insert"
on public.user_profiles
for insert
to anon, authenticated
with check (true);

-- Stage 2: run only after SUPABASE_SERVICE_ROLE_KEY is present in the
-- production server environment and the new API routes are deployed.
-- This turns the tables into service-role-only write targets.
--
-- drop policy if exists "registrations public insert" on public.registrations;
-- drop policy if exists "user profiles public insert" on public.user_profiles;
-- revoke all on table public.registrations from anon, authenticated;
-- revoke all on table public.user_profiles from anon, authenticated;
