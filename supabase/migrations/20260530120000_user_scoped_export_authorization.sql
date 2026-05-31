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
  if auth.uid() is null or auth.uid() <> target_user_id then
    raise insufficient_privilege using message = 'Authenticated user does not match export target.';
  end if;

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

revoke execute on function public.authorize_pdf_export(uuid, text) from public;
grant execute on function public.authorize_pdf_export(uuid, text) to authenticated;
grant execute on function public.authorize_pdf_export(uuid, text) to service_role;
