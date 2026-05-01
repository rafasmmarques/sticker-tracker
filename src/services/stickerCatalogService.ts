import { supabase } from "../lib/supabase";
import type { Sticker } from "../types/sticker";

type TeamRelation = {
  id: number;
  slug: string;
  name: string;
  fifa_code: string | null;
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
  player_name: string | null;
  player_position: string | null;
  is_special: boolean;
  special_finish: string | null;
  section: string | null;
  page_number: number | null;
  display_order: number;
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
      player_name,
      player_position,
      is_special,
      special_finish,
      section,
      page_number,
      display_order,
      team:teams (
        id,
        slug,
        name,
        fifa_code,
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
    `
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
  const team = getSingleRelation(row.team);
  const type = getSingleRelation(row.type);

  return {
    id: row.id,
    code: row.code,
    number: row.number,
    playerName: row.player_name,
    playerPosition: row.player_position,
    isSpecial: row.is_special,
    specialFinish: row.special_finish,
    section: row.section,
    pageNumber: row.page_number,
    displayOrder: row.display_order,
    team: team
      ? {
          id: team.id,
          slug: team.slug,
          name: team.name,
          fifaCode: team.fifa_code,
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
