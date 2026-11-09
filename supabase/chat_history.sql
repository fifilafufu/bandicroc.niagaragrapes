-- Niagara Grapes: each logged-in user's Grape Bot chat, synced live to all their devices.
-- Paste this whole file into Supabase → SQL Editor → New query → Run. Safe to run more than once.

create table if not exists public.chat_history (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  messages   jsonb not null default '[]'::jsonb check (pg_column_size(messages) < 200000),
  updated_at timestamptz not null default now()
);

-- Only logged-in users can reach the table, and logged-out visitors get nothing.
grant select, insert, update, delete on public.chat_history to authenticated;
revoke all on public.chat_history from anon;

-- Row-level security: each user can only see and change their own chat.
alter table public.chat_history enable row level security;

drop policy if exists "Read own chat"   on public.chat_history;
drop policy if exists "Insert own chat" on public.chat_history;
drop policy if exists "Update own chat" on public.chat_history;
drop policy if exists "Delete own chat" on public.chat_history;

create policy "Read own chat" on public.chat_history
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Insert own chat" on public.chat_history
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Update own chat" on public.chat_history
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Delete own chat" on public.chat_history
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Live sync to the user's other signed-in devices (Realtime also respects RLS).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'chat_history'
  ) then
    alter publication supabase_realtime add table public.chat_history;
  end if;
end $$;
