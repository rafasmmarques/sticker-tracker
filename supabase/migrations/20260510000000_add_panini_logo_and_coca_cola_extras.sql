alter table public.stickers
add column if not exists counts_for_completion boolean not null default true;

alter table public.stickers
drop constraint if exists stickers_id_check;

alter table public.stickers
add constraint stickers_id_check check (id > 0);

alter table public.stickers
drop constraint if exists stickers_number_check;

alter table public.stickers
add constraint stickers_number_check check (number > 0);

alter table public.stickers
drop constraint if exists stickers_number_in_group_check;

alter table public.stickers
add constraint stickers_number_in_group_check check (number_in_group >= 0);

update public.albums
set
  total_stickers = 981,
  updated_at = now()
where slug = 'world-cup-2026';

insert into public.sticker_types (id, slug, name, is_special)
values
  (8, 'partner_extra', 'Extra promocional', false)
on conflict (id) do update
set
  slug = excluded.slug,
  name = excluded.name,
  is_special = excluded.is_special,
  updated_at = now();

with album as (
  select id
  from public.albums
  where slug = 'world-cup-2026'
)
insert into public.sticker_groups (
  album_id,
  team_id,
  code,
  name,
  type,
  display_order
)
select
  album.id,
  null,
  'PAN',
  'Logo Panini',
  'intro',
  0
from album
on conflict (album_id, code) do update
set
  team_id = excluded.team_id,
  name = excluded.name,
  type = excluded.type,
  display_order = excluded.display_order,
  updated_at = now();

with album as (
  select id
  from public.albums
  where slug = 'world-cup-2026'
)
insert into public.sticker_groups (
  album_id,
  team_id,
  code,
  name,
  type,
  display_order
)
select
  album.id,
  null,
  'CC',
  'Coca-Cola',
  'extra',
  50
from album
on conflict (album_id, code) do update
set
  team_id = excluded.team_id,
  name = excluded.name,
  type = excluded.type,
  display_order = excluded.display_order,
  updated_at = now();

with album as (
  select id
  from public.albums
  where slug = 'world-cup-2026'
),
panini_group as (
  select sticker_groups.id
  from public.sticker_groups
  join album on album.id = sticker_groups.album_id
  where sticker_groups.code = 'PAN'
),
cc_group as (
  select sticker_groups.id
  from public.sticker_groups
  join album on album.id = sticker_groups.album_id
  where sticker_groups.code = 'CC'
),
panini_logo as (
  select
    995 as id,
    'PAN-000' as code,
    995 as number,
    album.id as album_id,
    panini_group.id as sticker_group_id,
    null::bigint as team_id,
    6::smallint as sticker_type_id,
    '00' as album_code,
    'PAN' as group_code,
    0 as number_in_group,
    '00' as display_code,
    null::text as player_name,
    null::text as player_position,
    true as is_special,
    'Especial'::text as special_finish,
    true as counts_for_completion,
    'Logo Panini'::text as section,
    0 as display_order
  from album
  cross join panini_group
),
coca_cola_stickers as (
  select
    980 + sticker_number as id,
    format('CC-%s', lpad(sticker_number::text, 3, '0')) as code,
    980 + sticker_number as number,
    album.id as album_id,
    cc_group.id as sticker_group_id,
    null::bigint as team_id,
    8::smallint as sticker_type_id,
    format('CC%s', sticker_number) as album_code,
    'CC' as group_code,
    sticker_number as number_in_group,
    format('CC%s', sticker_number) as display_code,
    null::text as player_name,
    null::text as player_position,
    false as is_special,
    null::text as special_finish,
    false as counts_for_completion,
    'Coca-Cola'::text as section,
    980 + sticker_number as display_order
  from album
  cross join cc_group
  cross join generate_series(1, 14) as sticker_number
),
catalog as (
  select * from panini_logo
  union all
  select * from coca_cola_stickers
)
insert into public.stickers (
  id,
  code,
  number,
  album_id,
  sticker_group_id,
  team_id,
  sticker_type_id,
  album_code,
  group_code,
  number_in_group,
  display_code,
  player_name,
  player_position,
  is_special,
  special_finish,
  counts_for_completion,
  section,
  display_order
)
select
  id,
  code,
  number,
  album_id,
  sticker_group_id,
  team_id,
  sticker_type_id,
  album_code,
  group_code,
  number_in_group,
  display_code,
  player_name,
  player_position,
  is_special,
  special_finish,
  counts_for_completion,
  section,
  display_order
from catalog
on conflict (id) do update
set
  code = excluded.code,
  number = excluded.number,
  album_id = excluded.album_id,
  sticker_group_id = excluded.sticker_group_id,
  team_id = excluded.team_id,
  sticker_type_id = excluded.sticker_type_id,
  album_code = excluded.album_code,
  group_code = excluded.group_code,
  number_in_group = excluded.number_in_group,
  display_code = excluded.display_code,
  player_name = excluded.player_name,
  player_position = excluded.player_position,
  is_special = excluded.is_special,
  special_finish = excluded.special_finish,
  counts_for_completion = excluded.counts_for_completion,
  section = excluded.section,
  display_order = excluded.display_order,
  updated_at = now();
