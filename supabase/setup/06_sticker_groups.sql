create table public.sticker_groups (
  id bigserial primary key,
  album_id bigint not null references public.albums(id) on delete cascade,
  team_id bigint references public.teams(id) on delete set null,
  code text not null,
  name text not null,
  type text not null,
  display_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sticker_groups_album_code_unique unique (album_id, code)
);

create index sticker_groups_album_id_idx on public.sticker_groups (album_id);
create index sticker_groups_code_idx on public.sticker_groups (code);
create index sticker_groups_team_id_idx on public.sticker_groups (team_id);

create trigger sticker_groups_set_updated_at
before update on public.sticker_groups
for each row execute function public.set_updated_at();
