import { supabase } from "../lib/supabase";
import type { Sticker } from "../types/sticker";

type AlbumRelation = {
  id: number;
  slug: string;
  name: string;
  year: number;
};

type StickerGroupRelation = {
  id: number;
  code: string;
  name: string;
  type: string;
  display_order: number;
};

type TeamRelation = {
  id: number;
  slug: string;
  name: string;
  country_code: string | null;
  fifa_code: string | null;
  album_code: string | null;
  group_letter: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
};

type StickerTypeRelation = {
  id: number;
  slug: string;
  name: string;
  is_special: boolean;
};

type StickerCatalogRow = {
  id: number;
  code: string;
  number: number;
  album_code: string;
  group_code: string;
  number_in_group: number;
  display_code: string;
  player_name: string | null;
  player_position: string | null;
  is_special: boolean;
  special_finish: string | null;
  counts_for_completion: boolean;
  section: string | null;
  page_number: number | null;
  display_order: number;
  album: AlbumRelation | AlbumRelation[] | null;
  sticker_group: StickerGroupRelation | StickerGroupRelation[] | null;
  team: TeamRelation | TeamRelation[] | null;
  type: StickerTypeRelation | StickerTypeRelation[] | null;
};

export async function fetchStickerCatalog(): Promise<Sticker[]> {
  const { data, error } = await supabase
    .from("stickers")
    .select(
      `
      id,
      code,
      number,
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
      page_number,
      display_order,
      album:albums (
        id,
        slug,
        name,
        year
      ),
      sticker_group:sticker_groups (
        id,
        code,
        name,
        type,
        display_order
      ),
      team:teams (
        id,
        slug,
        name,
        country_code,
        fifa_code,
        album_code,
        group_letter,
        primary_color,
        secondary_color,
        accent_color
      ),
      type:sticker_types (
        id,
        slug,
        name,
        is_special
      )
    `,
    )
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return ((data ?? []) as StickerCatalogRow[]).map(mapStickerCatalogRow);
}

function mapStickerCatalogRow(row: StickerCatalogRow): Sticker {
  const stickerGroup = getSingleRelation(row.sticker_group);
  const team = getSingleRelation(row.team);
  const type = getSingleRelation(row.type);

  return {
    id: row.id,
    code: row.code,
    number: row.number,
    albumCode: row.album_code,
    groupCode: row.group_code,
    numberInGroup: row.number_in_group,
    displayCode: row.display_code,
    playerName: row.player_name,
    playerPosition: row.player_position,
    isSpecial: row.is_special,
    specialFinish: row.special_finish,
    countsForCompletion: row.counts_for_completion,
    section: row.section,
    pageNumber: row.page_number,
    displayOrder: row.display_order,
    group: stickerGroup
      ? {
          id: stickerGroup.id,
          code: stickerGroup.code,
          name: stickerGroup.name,
          type: stickerGroup.type,
          displayOrder: stickerGroup.display_order,
        }
      : null,
    team: team
      ? {
          id: team.id,
          slug: team.slug,
          name: team.name,
          countryCode: team.country_code,
          fifaCode: team.fifa_code,
          albumCode: team.album_code,
          groupLetter: team.group_letter,
          primaryColor: team.primary_color,
          secondaryColor: team.secondary_color,
          accentColor: team.accent_color,
        }
      : null,
    type: type
      ? {
          id: type.id,
          slug: type.slug,
          name: type.name,
          isSpecial: type.is_special,
        }
      : null,
  };
}

function getSingleRelation<T>(relation: T | T[] | null): T | null {
  if (!relation) {
    return null;
  }

  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
}
