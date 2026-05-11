create table public.albums (
  id bigserial primary key,
  slug text not null unique,
  name text not null,
  year integer not null,
  total_stickers integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index albums_slug_idx on public.albums (slug);

create trigger albums_set_updated_at
before update on public.albums
for each row execute function public.set_updated_at();
