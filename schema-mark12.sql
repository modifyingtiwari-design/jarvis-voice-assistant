-- Mark XII additions applied to the existing authenticated-user schema.
alter table public.conversations add column if not exists workspace text not null default 'Personal' check(char_length(workspace) between 1 and 60);
alter table public.memory_notes add column if not exists deleted_at timestamptz;
alter table public.profiles add column if not exists reply_length text not null default 'balanced' check(reply_length in ('brief','balanced','detailed'));
alter table public.profiles add column if not exists humour integer not null default 1 check(humour between 0 and 3);
create table if not exists public.planner_items (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(char_length(title) between 1 and 300), due_date date, done boolean not null default false,
 workspace text not null default 'Personal' check(char_length(workspace) between 1 and 60), created_at timestamptz not null default now()
);
alter table public.planner_items enable row level security;
do $$ begin if not exists(select 1 from pg_policies where schemaname='public' and tablename='planner_items' and policyname='planner_items_own_all') then
 create policy planner_items_own_all on public.planner_items for all to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
end if; end $$;
grant select,insert,update,delete on public.planner_items to authenticated;
create index if not exists planner_items_user_due on public.planner_items(user_id,due_date);
create index if not exists conversations_user_workspace on public.conversations(user_id,workspace,updated_at desc);