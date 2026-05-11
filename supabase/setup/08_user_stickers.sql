create table public.user_stickers (
  user_id uuid not null references auth.users(id) on delete cascade,
  sticker_id integer not null references public.stickers(id) on delete cascade,
  quantity integer not null check (quantity >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, sticker_id)
);

create trigger user_stickers_set_updated_at
before update on public.user_stickers
for each row execute function public.set_updated_at();
