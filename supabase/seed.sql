insert into public.albums (slug, name, year, total_stickers)
values ('world-cup-2026', 'World Cup 2026', 2026, 995)
on conflict (slug) do update
set
  name = excluded.name,
  year = excluded.year,
  total_stickers = excluded.total_stickers,
  updated_at = now();

insert into public.sticker_types (id, slug, name, is_special)
values
  (1, 'player', 'Jogador', false),
  (2, 'team_crest', 'Escudo da seleção', true),
  (3, 'team_photo', 'Seleção completa', false),
  (4, 'introduction', 'Introdução', true),
  (5, 'museum', 'Museum', true),
  (6, 'special', 'Especial', true),
  (7, 'other', 'Outro', false),
  (8, 'partner_extra', 'Extra promocional', false)
on conflict (id) do update
set
  slug = excluded.slug,
  name = excluded.name,
  is_special = excluded.is_special,
  updated_at = now();

with team_seed (
  slug,
  name,
  country_code,
  fifa_code,
  album_code,
  group_letter,
  confederation,
  is_host,
  display_order,
  primary_color,
  secondary_color,
  accent_color
) as (
  values
    ('mexico', 'México', 'MEX', 'MEX', 'MEX', 'A', 'CONCACAF', true, 1, '#006847', '#ffffff', '#ce1126'),
    ('south-africa', 'África do Sul', 'ZAF', 'RSA', 'RSA', 'A', 'CAF', false, 2, '#007749', '#ffb81c', '#000000'),
    ('south-korea', 'Coreia do Sul', 'KOR', 'KOR', 'KOR', 'A', 'AFC', false, 3, '#c60c30', '#ffffff', '#003478'),
    ('czechia', 'Tchéquia', 'CZE', 'CZE', 'CZE', 'A', 'UEFA', false, 4, '#d7141a', '#ffffff', '#11457e'),

    ('canada', 'Canadá', 'CAN', 'CAN', 'CAN', 'B', 'CONCACAF', true, 5, '#ff0000', '#ffffff', '#111111'),
    ('bosnia-herzegovina', 'Bósnia e Herzegovina', 'BIH', 'BIH', 'BIH', 'B', 'UEFA', false, 6, '#002395', '#fecb00', '#ffffff'),
    ('qatar', 'Catar', 'QAT', 'QAT', 'QAT', 'B', 'AFC', false, 7, '#8a1538', '#ffffff', '#111111'),
    ('switzerland', 'Suíça', 'CHE', 'SUI', 'SUI', 'B', 'UEFA', false, 8, '#ff0000', '#ffffff', '#111111'),

    ('brazil', 'Brasil', 'BRA', 'BRA', 'BRA', 'C', 'CONMEBOL', false, 9, '#009c3b', '#ffdf00', '#002776'),
    ('morocco', 'Marrocos', 'MAR', 'MAR', 'MAR', 'C', 'CAF', false, 10, '#c1272d', '#006233', '#ffffff'),
    ('scotland', 'Escócia', 'SCO', 'SCO', 'SCO', 'C', 'UEFA', false, 11, '#005eb8', '#ffffff', '#111111'),
    ('haiti', 'Haiti', 'HTI', 'HAI', 'HAI', 'C', 'CONCACAF', false, 12, '#00209f', '#d21034', '#ffffff'),

    ('usa', 'Estados Unidos', 'USA', 'USA', 'USA', 'D', 'CONCACAF', true, 13, '#3c3b6e', '#ffffff', '#b22234'),
    ('paraguay', 'Paraguai', 'PRY', 'PAR', 'PAR', 'D', 'CONMEBOL', false, 14, '#d52b1e', '#ffffff', '#0038a8'),
    ('australia', 'Austrália', 'AUS', 'AUS', 'AUS', 'D', 'AFC', false, 15, '#00843d', '#ffcd00', '#111111'),
    ('turkiye', 'Turquia', 'TUR', 'TUR', 'TUR', 'D', 'UEFA', false, 16, '#e30a17', '#ffffff', '#111111'),

    ('germany', 'Alemanha', 'DEU', 'GER', 'GER', 'E', 'UEFA', false, 17, '#000000', '#dd0000', '#ffce00'),
    ('curacao', 'Curaçao', 'CUW', 'CUW', 'CUW', 'E', 'CONCACAF', false, 18, '#002b7f', '#f9e814', '#ffffff'),
    ('ivory-coast', 'Costa do Marfim', 'CIV', 'CIV', 'CIV', 'E', 'CAF', false, 19, '#f77f00', '#ffffff', '#009e60'),
    ('ecuador', 'Equador', 'ECU', 'ECU', 'ECU', 'E', 'CONMEBOL', false, 20, '#ffdd00', '#034ea2', '#ed1c24'),

    ('netherlands', 'Holanda', 'NLD', 'NED', 'NED', 'F', 'UEFA', false, 21, '#ff6900', '#ffffff', '#21468b'),
    ('japan', 'Japão', 'JPN', 'JPN', 'JPN', 'F', 'AFC', false, 22, '#bc002d', '#ffffff', '#111111'),
    ('sweden', 'Suécia', 'SWE', 'SWE', 'SWE', 'F', 'UEFA', false, 23, '#006aa7', '#fecc00', '#ffffff'),
    ('tunisia', 'Tunísia', 'TUN', 'TUN', 'TUN', 'F', 'CAF', false, 24, '#e70013', '#ffffff', '#111111'),

    ('belgium', 'Bélgica', 'BEL', 'BEL', 'BEL', 'G', 'UEFA', false, 25, '#000000', '#fae042', '#ed2939'),
    ('iran', 'Irã', 'IRN', 'IRN', 'IRN', 'G', 'AFC', false, 26, '#239f40', '#ffffff', '#da0000'),
    ('egypt', 'Egito', 'EGY', 'EGY', 'EGY', 'G', 'CAF', false, 27, '#ce1126', '#ffffff', '#000000'),
    ('new-zealand', 'Nova Zelândia', 'NZL', 'NZL', 'NZL', 'G', 'OFC', false, 28, '#00247d', '#ffffff', '#cc142b'),

    ('spain', 'Espanha', 'ESP', 'ESP', 'ESP', 'H', 'UEFA', false, 29, '#aa151b', '#f1bf00', '#111111'),
    ('uruguay', 'Uruguai', 'URY', 'URU', 'URU', 'H', 'CONMEBOL', false, 30, '#0038a8', '#ffffff', '#fcd116'),
    ('saudi-arabia', 'Arábia Saudita', 'SAU', 'KSA', 'KSA', 'H', 'AFC', false, 31, '#006c35', '#ffffff', '#111111'),
    ('cape-verde', 'Cabo Verde', 'CPV', 'CPV', 'CPV', 'H', 'CAF', false, 32, '#003893', '#ffffff', '#cf2027'),

    ('france', 'França', 'FRA', 'FRA', 'FRA', 'I', 'UEFA', false, 33, '#002654', '#ffffff', '#ed2939'),
    ('senegal', 'Senegal', 'SEN', 'SEN', 'SEN', 'I', 'CAF', false, 34, '#00853f', '#fdef42', '#e31b23'),
    ('iraq', 'Iraque', 'IRQ', 'IRQ', 'IRQ', 'I', 'AFC', false, 35, '#ce1126', '#ffffff', '#000000'),
    ('norway', 'Noruega', 'NOR', 'NOR', 'NOR', 'I', 'UEFA', false, 36, '#ba0c2f', '#ffffff', '#00205b'),

    ('argentina', 'Argentina', 'ARG', 'ARG', 'ARG', 'J', 'CONMEBOL', false, 37, '#75aadb', '#ffffff', '#fcbf49'),
    ('algeria', 'Argélia', 'DZA', 'ALG', 'ALG', 'J', 'CAF', false, 38, '#006233', '#ffffff', '#d21034'),
    ('austria', 'Áustria', 'AUT', 'AUT', 'AUT', 'J', 'UEFA', false, 39, '#ed2939', '#ffffff', '#111111'),
    ('jordan', 'Jordânia', 'JOR', 'JOR', 'JOR', 'J', 'AFC', false, 40, '#000000', '#ffffff', '#007a3d'),

    ('portugal', 'Portugal', 'PRT', 'POR', 'POR', 'K', 'UEFA', false, 41, '#006600', '#ff0000', '#ffcc00'),
    ('congo-dr', 'RD Congo', 'COD', 'COD', 'COD', 'K', 'CAF', false, 42, '#007fff', '#f7d618', '#ce1021'),
    ('uzbekistan', 'Uzbequistão', 'UZB', 'UZB', 'UZB', 'K', 'AFC', false, 43, '#0099b5', '#ffffff', '#1eb53a'),
    ('colombia', 'Colômbia', 'COL', 'COL', 'COL', 'K', 'CONMEBOL', false, 44, '#fcd116', '#003893', '#ce1126'),

    ('england', 'Inglaterra', 'ENG', 'ENG', 'ENG', 'L', 'UEFA', false, 45, '#ffffff', '#ce1124', '#00247d'),
    ('croatia', 'Croácia', 'CRO', 'CRO', 'CRO', 'L', 'UEFA', false, 46, '#ff0000', '#ffffff', '#171796'),
    ('ghana', 'Gana', 'GHA', 'GHA', 'GHA', 'L', 'CAF', false, 47, '#ce1126', '#fcd116', '#006b3f'),
    ('panama', 'Panamá', 'PAN', 'PAN', 'PAN', 'L', 'CONCACAF', false, 48, '#005293', '#ffffff', '#d21034')
)
insert into public.teams (
  slug,
  name,
  country_code,
  fifa_code,
  album_code,
  group_letter,
  confederation,
  is_host,
  display_order,
  primary_color,
  secondary_color,
  accent_color
)
select
  slug,
  name,
  country_code,
  fifa_code,
  album_code,
  group_letter,
  confederation,
  is_host,
  display_order,
  primary_color,
  secondary_color,
  accent_color
from team_seed
on conflict (slug) do update
set
  name = excluded.name,
  country_code = excluded.country_code,
  fifa_code = excluded.fifa_code,
  album_code = excluded.album_code,
  group_letter = excluded.group_letter,
  confederation = excluded.confederation,
  is_host = excluded.is_host,
  display_order = excluded.display_order,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  accent_color = excluded.accent_color,
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
  'FWC',
  'Introdução e Museum',
  'intro',
  1
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
  teams.id,
  teams.album_code,
  teams.name,
  'team',
  teams.display_order + 1
from album
join public.teams on teams.album_code is not null
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
fwc_group as (
  select sticker_groups.id
  from public.sticker_groups
  join album on album.id = sticker_groups.album_id
  where sticker_groups.code = 'FWC'
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
fwc_stickers as (
  select
    sticker_number as id,
    format('FWC-%s', lpad(sticker_number::text, 3, '0')) as code,
    sticker_number as number,
    album.id as album_id,
    fwc_group.id as sticker_group_id,
    null::bigint as team_id,
    case
      when sticker_number <= 9 then 4
      else 5
    end as sticker_type_id,
    format('FWC-%s', lpad(sticker_number::text, 3, '0')) as album_code,
    'FWC' as group_code,
    sticker_number as number_in_group,
    format('FWC %s', sticker_number) as display_code,
    null::text as player_name,
    null::text as player_position,
    true as is_special,
    'Especial'::text as special_finish,
    true as counts_for_completion,
    case
      when sticker_number <= 9 then 'Introdução'
      else 'Museum'
    end as section,
    sticker_number as display_order
  from album
  cross join fwc_group
  cross join generate_series(1, 20) as sticker_number
),
team_stickers as (
  select
    20 + ((teams.display_order - 1) * 20) + sticker_number as id,
    format('%s-%s', teams.album_code, lpad(sticker_number::text, 3, '0')) as code,
    20 + ((teams.display_order - 1) * 20) + sticker_number as number,
    album.id as album_id,
    sticker_groups.id as sticker_group_id,
    teams.id as team_id,
    case
      when sticker_number = 1 then 2
      when sticker_number = 2 then 3
      else 1
    end as sticker_type_id,
    format('%s-%s', teams.album_code, lpad(sticker_number::text, 3, '0')) as album_code,
    teams.album_code as group_code,
    sticker_number as number_in_group,
    format('%s %s', teams.album_code, sticker_number) as display_code,
    null::text as player_name,
    null::text as player_position,
    sticker_number = 1 as is_special,
    case
      when sticker_number = 1 then 'Especial'
      else null
    end as special_finish,
    true as counts_for_completion,
    teams.name as section,
    20 + ((teams.display_order - 1) * 20) + sticker_number as display_order
  from album
  join public.teams on teams.album_code is not null
  join public.sticker_groups
    on sticker_groups.album_id = album.id
   and sticker_groups.team_id = teams.id
  cross join generate_series(1, 20) as sticker_number
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
  select * from fwc_stickers
  union all
  select * from team_stickers
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
