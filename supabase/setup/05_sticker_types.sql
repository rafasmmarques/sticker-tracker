create table public.sticker_types (
  id smallint primary key,
  slug text not null unique,
  name text not null,
  is_special boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger sticker_types_set_updated_at
before update on public.sticker_types
for each row execute function public.set_updated_at();
