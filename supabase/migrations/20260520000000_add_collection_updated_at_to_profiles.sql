alter table public.profiles
add column if not exists collection_updated_at timestamptz;

update public.profiles
set collection_updated_at = collection_versions.collection_updated_at
from (
  select
    user_id,
    max(updated_at) as collection_updated_at
  from public.user_stickers
  group by user_id
) as collection_versions
where profiles.id = collection_versions.user_id
  and profiles.collection_updated_at is null;

update public.profiles
set collection_updated_at = updated_at
where collection_updated_at is null;
