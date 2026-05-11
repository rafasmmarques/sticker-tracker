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

create index teams_name_idx on public.teams (name);
create index teams_name_trgm_idx on public.teams using gin (name gin_trgm_ops);
create index teams_album_code_idx on public.teams (album_code);
create index teams_group_letter_idx on public.teams (group_letter);

create trigger teams_set_updated_at
before update on public.teams
for each row execute function public.set_updated_at();
