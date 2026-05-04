-- Add link_ativo column to profiles (renamed from is_public concept)
alter table public.profiles
add column if not exists link_ativo boolean not null default false;

-- Copy existing is_public values to link_ativo for backward compatibility
update public.profiles set link_ativo = is_public where link_ativo = false and is_public = true;

-- Add index for username lookup (faster public page lookups)
create index if not exists profiles_username_idx on public.profiles (username) where username is not null;

-- Add index for link_ativo lookup
create index if not exists profiles_link_ativo_idx on public.profiles (link_ativo) where link_ativo = true;

-- Update RLS policies to use link_ativo instead of is_public

drop policy if exists profiles_select_own_or_public on public.profiles;

create policy profiles_select_own_or_public
on public.profiles
for select
using (
  auth.uid() = id 
  or (link_ativo = true and username is not null)
);

-- Update user_stickers policy to use link_ativo

drop policy if exists user_stickers_select_own_or_public on public.user_stickers;

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

-- Grant public read access to profiles with active trade links
grant select (id, username, link_ativo, created_at) on public.profiles to anon;