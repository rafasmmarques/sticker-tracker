create table if not exists public.scanner_rate_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_start timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.scanner_rate_limits enable row level security;

create trigger scanner_rate_limits_set_updated_at
before update on public.scanner_rate_limits
for each row execute function public.set_updated_at();

create or replace function public.consume_scanner_rate_limit(
  max_requests integer default 30,
  window_seconds integer default 3600
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_window_start timestamptz;
  current_request_count integer;
  retry_after_seconds integer;
begin
  if current_user_id is null then
    return jsonb_build_object(
      'allowed', false,
      'reason', 'unauthenticated',
      'retryAfterSeconds', null
    );
  end if;

  insert into public.scanner_rate_limits (user_id, window_start, request_count)
  values (current_user_id, now(), 1)
  on conflict (user_id) do update
    set
      window_start = case
        when public.scanner_rate_limits.window_start <= now() - make_interval(secs => window_seconds)
          then now()
        else public.scanner_rate_limits.window_start
      end,
      request_count = case
        when public.scanner_rate_limits.window_start <= now() - make_interval(secs => window_seconds)
          then 1
        else public.scanner_rate_limits.request_count + 1
      end
  returning window_start, request_count
  into current_window_start, current_request_count;

  if current_request_count <= max_requests then
    return jsonb_build_object(
      'allowed', true,
      'remaining', greatest(max_requests - current_request_count, 0),
      'retryAfterSeconds', 0
    );
  end if;

  retry_after_seconds := greatest(
    1,
    ceil(extract(epoch from (current_window_start + make_interval(secs => window_seconds) - now())))::integer
  );

  return jsonb_build_object(
    'allowed', false,
    'reason', 'rate_limited',
    'remaining', 0,
    'retryAfterSeconds', retry_after_seconds
  );
end;
$$;

revoke all on public.scanner_rate_limits from anon, authenticated;
revoke execute on function public.consume_scanner_rate_limit(integer, integer) from public;
grant execute on function public.consume_scanner_rate_limit(integer, integer) to authenticated;
