grant usage on schema public to anon, authenticated;

grant select on public.albums to anon, authenticated;
grant select on public.teams to anon, authenticated;
grant select on public.sticker_types to anon, authenticated;
grant select on public.sticker_groups to anon, authenticated;
grant select on public.stickers to anon, authenticated;

grant select (id, username, link_ativo, created_at) on public.profiles to anon;
grant select, insert, update on public.profiles to authenticated;

grant select on public.user_stickers to anon;
grant select, insert, update, delete on public.user_stickers to authenticated;
