-- Grapes: wines each logged-in user made in Make Your Wine, synced to all their devices.
-- Paste this whole file into Supabase > SQL Editor > New query > Run. Safe to run more than once.

create table if not exists public.saved_wines (
  id            uuid primary key,                   -- made by the app, so a wine is never saved twice
  user_id       uuid not null references auth.users (id) on delete cascade,
  name          text not null check (char_length(name) between 1 and 40),
  grape         text not null check (char_length(grape) between 1 and 40),
  inputs        jsonb not null check (pg_column_size(inputs) < 2000),   -- the slider settings
  result        jsonb not null check (pg_column_size(result) < 4000),   -- the wine as it came out
  model_version smallint not null default 1,         -- which version of the formulas made it
  created_at    timestamptz not null default now()
);

create index if not exists saved_wines_user_time on public.saved_wines (user_id, created_at desc);

-- Only logged-in users can reach the table, and logged-out visitors get nothing.
grant select, insert, delete on public.saved_wines to authenticated;
revoke all on public.saved_wines from anon;

-- Row-level security: each user can only see, add and remove their own wines.
alter table public.saved_wines enable row level security;

drop policy if exists "Read own wines"   on public.saved_wines;
drop policy if exists "Insert own wines" on public.saved_wines;
drop policy if exists "Delete own wines" on public.saved_wines;

create policy "Read own wines" on public.saved_wines
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Insert own wines" on public.saved_wines
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Delete own wines" on public.saved_wines
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Keep only each user's newest 50 wines, so the free database never fills up.
create or replace function public.trim_saved_wines() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  delete from public.saved_wines
  where user_id = new.user_id
    and id in (
      select id from public.saved_wines
      where user_id = new.user_id
      order by created_at desc
      offset 50
    );
  return null;
end $$;

drop trigger if exists trim_saved_wines on public.saved_wines;
create trigger trim_saved_wines after insert on public.saved_wines
  for each row execute function public.trim_saved_wines();

-- Live sync to the user's other signed-in devices (Realtime also respects RLS).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'saved_wines'
  ) then
    alter publication supabase_realtime add table public.saved_wines;
  end if;
end $$;
