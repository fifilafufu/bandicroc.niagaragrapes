-- Grapes: each logged-in user's quiz scores, synced to all their devices.
-- Paste this whole file into Supabase > SQL Editor > New query > Run. Safe to run more than once.

create table if not exists public.quiz_results (
  id        uuid primary key,                       -- made by the app, so a score is never saved twice
  user_id   uuid not null references auth.users (id) on delete cascade,
  quiz      text not null check (char_length(quiz) between 1 and 40),  -- e.g. "cat:varieties"
  score     smallint not null check (score >= 0),
  total     smallint not null check (total between 1 and 100),
  taken_at  timestamptz not null default now(),
  check (score <= total)
);

create index if not exists quiz_results_user_time on public.quiz_results (user_id, taken_at desc);

-- Only logged-in users can reach the table, and logged-out visitors get nothing.
grant select, insert, delete on public.quiz_results to authenticated;
revoke all on public.quiz_results from anon;

-- Row-level security: each user can only see, add and remove their own scores.
alter table public.quiz_results enable row level security;

drop policy if exists "Read own scores"   on public.quiz_results;
drop policy if exists "Insert own scores" on public.quiz_results;
drop policy if exists "Delete own scores" on public.quiz_results;

create policy "Read own scores" on public.quiz_results
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Insert own scores" on public.quiz_results
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Delete own scores" on public.quiz_results
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Keep only each user's newest 200 scores, so the free database never fills up.
create or replace function public.trim_quiz_results() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  delete from public.quiz_results
  where user_id = new.user_id
    and id in (
      select id from public.quiz_results
      where user_id = new.user_id
      order by taken_at desc
      offset 200
    );
  return null;
end $$;

drop trigger if exists trim_quiz_results on public.quiz_results;
create trigger trim_quiz_results after insert on public.quiz_results
  for each row execute function public.trim_quiz_results();

-- Live sync to the user's other signed-in devices (Realtime also respects RLS).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'quiz_results'
  ) then
    alter publication supabase_realtime add table public.quiz_results;
  end if;
end $$;
