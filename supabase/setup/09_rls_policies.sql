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
using (
  auth.uid() = id
  or (link_ativo = true and username is not null)
);

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
      and profiles.link_ativo = true
      and profiles.username is not null
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
