create table if not exists public.book_package_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text,
  project_id text,
  page_package text,
  with_images boolean not null default false,
  price_id text,
  status text not null default 'pending',
  stripe_customer_id text,
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.book_package_payments enable row level security;

drop policy if exists "Users can read own book package payments" on public.book_package_payments;
create policy "Users can read own book package payments"
  on public.book_package_payments for select
  using (auth.uid() = user_id);
