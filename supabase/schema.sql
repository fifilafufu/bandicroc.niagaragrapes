-- Niagara Grapes: favourite grape per user, protected by row-level security.
-- Paste this whole file into Supabase → SQL Editor → New query → Run.

create table if not exists public.favourites (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  grape      text not null check (char_length(grape) between 1 and 40),
  updated_at timestamptz not null default now()
);

-- Row-level security: the database itself blocks access to other users' rows.
alter table public.favourites enable row level security;

drop policy if exists "Read own favourite"   on public.favourites;
drop policy if exists "Insert own favourite" on public.favourites;
drop policy if exists "Update own favourite" on public.favourites;
drop policy if exists "Delete own favourite" on public.favourites;

create policy "Read own favourite" on public.favourites
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Insert own favourite" on public.favourites
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Update own favourite" on public.favourites
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Delete own favourite" on public.favourites
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Live sync: push changes to the user's other signed-in devices (Realtime also respects RLS).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'favourites'
  ) then
    alter publication supabase_realtime add table public.favourites;
  end if;
end $$;
