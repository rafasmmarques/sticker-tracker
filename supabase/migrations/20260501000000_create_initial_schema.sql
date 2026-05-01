create extension if not exists pg_trgm;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.albums (
  id bigserial primary key,
  slug text not null unique,
  name text not null,
  year integer not null,
  total_stickers integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.teams (
  id bigserial primary key,
  slug text not null unique,
  name text not null,
  country_code text,
  fifa_code text,
  album_code text,
  group_letter text,
  confederation text,
  is_host boolean not null default false,
  display_order integer,
  primary_color text,
  secondary_color text,
  accent_color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index teams_album_code_unique
on public.teams (album_code)
where album_code is not null;

create table public.sticker_types (
  id smallint primary key,
  slug text not null unique,
  name text not null,
  is_special boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  number_in_group integer not null check (number_in_group > 0),
  display_code text not null,
  player_name text,
  player_position text,
  is_special boolean not null default false,
  special_finish text,
  section text,
  page_number integer,
  display_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stickers_album_album_code_unique unique (album_id, album_code),
  constraint stickers_album_group_number_unique unique (album_id, sticker_group_id, number_in_group)
);

create table public.user_stickers (
  user_id uuid not null references auth.users(id) on delete cascade,
  sticker_id integer not null references public.stickers(id) on delete cascade,
  quantity integer not null check (quantity >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, sticker_id)
);

create index albums_slug_idx on public.albums (slug);

create index teams_name_idx on public.teams (name);
create index teams_name_trgm_idx on public.teams using gin (name gin_trgm_ops);
create index teams_album_code_idx on public.teams (album_code);
create index teams_group_letter_idx on public.teams (group_letter);

create index sticker_groups_album_id_idx on public.sticker_groups (album_id);
create index sticker_groups_code_idx on public.sticker_groups (code);
create index sticker_groups_team_id_idx on public.sticker_groups (team_id);

create index stickers_album_id_idx on public.stickers (album_id);
create index stickers_sticker_group_id_idx on public.stickers (sticker_group_id);
create index stickers_team_id_idx on public.stickers (team_id);
create index stickers_sticker_type_id_idx on public.stickers (sticker_type_id);
create index stickers_album_code_idx on public.stickers (album_code);
create index stickers_group_code_idx on public.stickers (group_code);
create index stickers_display_code_idx on public.stickers (display_code);
create index stickers_player_name_trgm_idx on public.stickers using gin (player_name gin_trgm_ops);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger albums_set_updated_at
before update on public.albums
for each row execute function public.set_updated_at();

create trigger teams_set_updated_at
before update on public.teams
for each row execute function public.set_updated_at();

create trigger sticker_types_set_updated_at
before update on public.sticker_types
for each row execute function public.set_updated_at();

create trigger sticker_groups_set_updated_at
before update on public.sticker_groups
for each row execute function public.set_updated_at();

create trigger stickers_set_updated_at
before update on public.stickers
for each row execute function public.set_updated_at();

create trigger user_stickers_set_updated_at
before update on public.user_stickers
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, is_public)
  values (
    new.id,
    coalesce(split_part(new.email, '@', 1), 'Colecionador'),
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.albums enable row level security;
alter table public.teams enable row level security;
alter table public.sticker_types enable row level security;
alter table public.sticker_groups enable row level security;
alter table public.stickers enable row level security;
alter table public.user_stickers enable row level security;

create policy profiles_select_own_or_public
on public.profiles
for select
using (auth.uid() = id or is_public = true);

create policy profiles_insert_own
on public.profiles
for insert
with check (auth.uid() = id);

create policy profiles_update_own
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy albums_public_select
on public.albums
for select
using (true);

create policy teams_public_select
on public.teams
for select
using (true);

create policy sticker_types_public_select
on public.sticker_types
for select
using (true);

create policy sticker_groups_public_select
on public.sticker_groups
for select
using (true);

create policy stickers_public_select
on public.stickers
for select
using (true);

create policy user_stickers_select_own_or_public
on public.user_stickers
for select
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.profiles
    where profiles.id = user_stickers.user_id
      and profiles.is_public = true
  )
);

create policy user_stickers_insert_own
on public.user_stickers
for insert
with check (auth.uid() = user_id);

create policy user_stickers_update_own
on public.user_stickers
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy user_stickers_delete_own
on public.user_stickers
for delete
using (auth.uid() = user_id);

grant usage on schema public to anon, authenticated;

grant select on public.albums to anon, authenticated;
grant select on public.teams to anon, authenticated;
grant select on public.sticker_types to anon, authenticated;
grant select on public.sticker_groups to anon, authenticated;
grant select on public.stickers to anon, authenticated;

grant select on public.profiles to anon;
grant select, insert, update on public.profiles to authenticated;

grant select on public.user_stickers to anon;
grant select, insert, update, delete on public.user_stickers to authenticated;