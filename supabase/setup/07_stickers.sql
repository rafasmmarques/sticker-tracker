create table public.stickers (
  id integer primary key,
  code text not null unique,
  number integer not null unique,
  album_id bigint not null references public.albums(id) on delete cascade,
  sticker_group_id bigint not null references public.sticker_groups(id) on delete cascade,
  team_id bigint references public.teams(id) on delete set null,
  sticker_type_id smallint not null references public.sticker_types(id),
  album_code text not null,
  group_code text not null,
  number_in_group integer not null,
  display_code text not null,
  player_name text,
  player_position text,
  is_special boolean not null default false,
  special_finish text,
  counts_for_completion boolean not null default true,
  section text,
  page_number integer,
  display_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stickers_id_check check (id > 0),
  constraint stickers_number_check check (number > 0),
  constraint stickers_number_in_group_check check (number_in_group >= 0),
  constraint stickers_album_album_code_unique unique (album_id, album_code),
  constraint stickers_album_group_number_unique unique (album_id, sticker_group_id, number_in_group)
);

create index stickers_album_id_idx on public.stickers (album_id);
create index stickers_sticker_group_id_idx on public.stickers (sticker_group_id);
create index stickers_team_id_idx on public.stickers (team_id);
create index stickers_sticker_type_id_idx on public.stickers (sticker_type_id);
create index stickers_album_code_idx on public.stickers (album_code);
create index stickers_group_code_idx on public.stickers (group_code);
create index stickers_display_code_idx on public.stickers (display_code);
create index stickers_player_name_trgm_idx on public.stickers using gin (player_name gin_trgm_ops);

create trigger stickers_set_updated_at
before update on public.stickers
for each row execute function public.set_updated_at();
