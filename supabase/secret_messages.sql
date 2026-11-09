-- Niagara Grapes: a private "secret message" per user, synced live to all their devices.
-- Paste this whole file into Supabase → SQL Editor → New query → Run. Safe to run more than once.

create table if not exists public.secret_messages (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  message    text not null default '' check (char_length(message) <= 1000),
  updated_at timestamptz not null default now()
);

-- Only logged-in users can reach the table, and logged-out visitors get nothing.
grant select, insert, update, delete on public.secret_messages to authenticated;
revoke all on public.secret_messages from anon;

-- Row-level security: each user can only see and change their own message.
alter table public.secret_messages enable row level security;

drop policy if exists "Read own secret"   on public.secret_messages;
drop policy if exists "Insert own secret" on public.secret_messages;
drop policy if exists "Update own secret" on public.secret_messages;
drop policy if exists "Delete own secret" on public.secret_messages;

create policy "Read own secret" on public.secret_messages
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Insert own secret" on public.secret_messages
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Update own secret" on public.secret_messages
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Delete own secret" on public.secret_messages
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Live sync to the user's other signed-in devices (Realtime also respects RLS).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'secret_messages'
  ) then
    alter publication supabase_realtime add table public.secret_messages;
  end if;
end $$;
