-- Harden AILA form/profile tables before enabling RLS.
--
-- Run this in Supabase SQL Editor after setting SUPABASE_SERVICE_ROLE_KEY
-- in the Next.js server environment. The app API routes write through the
-- server-only service role client, so anon/authenticated table policies are
-- intentionally not needed for these sensitive lead/profile tables.

alter table public.registrations enable row level security;
alter table public.user_profiles enable row level security;

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

revoke all on table public.registrations from anon, authenticated;
revoke all on table public.user_profiles from anon, authenticated;
