-- Bootstrap runner for a fresh Supabase project.
--
-- This file is intended for psql/Supabase CLI usage, because it relies on
-- psql's \ir include command. If you are using the Supabase SQL editor, run
-- the numbered files in this directory manually, from 01 to 10, then run
-- ../seed.sql.

\ir 01_extensions_and_functions.sql
\ir 02_profiles.sql
\ir 03_albums.sql
\ir 04_teams.sql
\ir 05_sticker_types.sql
\ir 06_sticker_groups.sql
\ir 07_stickers.sql
\ir 08_user_stickers.sql
\ir 09_rls_policies.sql
\ir 10_grants.sql
