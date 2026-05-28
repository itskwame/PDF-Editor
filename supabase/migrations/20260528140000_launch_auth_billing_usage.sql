create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'basic', 'pro')),
  status text not null default 'free',
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.export_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  period_month text not null check (period_month ~ '^[0-9]{4}-[0-9]{2}$'),
  count integer not null default 0 check (count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, period_month)
);

create table if not exists public.ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  period_month text not null check (period_month ~ '^[0-9]{4}-[0-9]{2}$'),
  count integer not null default 0 check (count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, period_month)
);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.export_usage enable row level security;
alter table public.ai_usage enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can read own subscription" on public.subscriptions;
create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can read own export usage" on public.export_usage;
create policy "Users can read own export usage"
  on public.export_usage for select
  using (auth.uid() = user_id);

drop policy if exists "Users can read own ai usage" on public.ai_usage;
create policy "Users can read own ai usage"
  on public.ai_usage for select
  using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'free')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do update
  set email = excluded.email,
      updated_at = now();

insert into public.subscriptions (user_id, plan, status)
select id, 'free', 'free' from auth.users
on conflict (user_id) do nothing;

create or replace function public.authorize_pdf_export(
  target_user_id uuid,
  target_month text
)
returns table (
  allowed boolean,
  plan text,
  used integer,
  "limit" integer,
  remaining integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  active_plan text := 'free';
  monthly_limit integer := 3;
  current_count integer := 0;
begin
  select
    case
      when s.status in ('active', 'trialing') and s.plan in ('basic', 'pro') then s.plan
      else 'free'
    end
  into active_plan
  from public.subscriptions s
  where s.user_id = target_user_id;

  active_plan := coalesce(active_plan, 'free');

  monthly_limit := case active_plan
    when 'basic' then 25
    when 'pro' then 100
    else 3
  end;

  insert into public.export_usage (user_id, period_month, count)
  values (target_user_id, target_month, 0)
  on conflict (user_id, period_month) do nothing;

  select eu.count
  into current_count
  from public.export_usage eu
  where eu.user_id = target_user_id
    and eu.period_month = target_month
  for update;

  if current_count >= monthly_limit then
    return query select false, active_plan, current_count, monthly_limit, 0;
    return;
  end if;

  update public.export_usage
  set count = count + 1,
      updated_at = now()
  where user_id = target_user_id
    and period_month = target_month
  returning count into current_count;

  return query select
    true,
    active_plan,
    current_count,
    monthly_limit,
    greatest(monthly_limit - current_count, 0);
end;
$$;

grant execute on function public.authorize_pdf_export(uuid, text) to service_role;
