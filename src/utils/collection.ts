import type {
  CollectionSummary,
  Sticker,
  StickerTeam,
  StickerCollection,
} from "../types/sticker";

export type CompletedSelection = {
  key: string;
  name: string;
};

export function filterStickersByCode(
  stickers: Sticker[],
  search: string,
): Sticker[] {
  const normalizedSearch = normalizeSearch(search);

  if (!normalizedSearch) {
    return stickers;
  }

  return stickers.filter((sticker) => {
    const searchableContent = [
      sticker.code,
      sticker.albumCode,
      sticker.displayCode,
      sticker.groupCode,
      sticker.number.toString(),
      sticker.numberInGroup.toString(),
      sticker.playerName,
      sticker.playerPosition,
      sticker.team?.name,
      sticker.team?.fifaCode,
      sticker.team?.albumCode,
      sticker.team?.groupLetter,
      sticker.group?.name,
      sticker.type?.name,
      sticker.specialFinish,
      sticker.section,
    ]
      .filter(Boolean)
      .map(String)
      .map(normalizeSearch)
      .join(" ");

    return searchableContent.includes(normalizedSearch);
  });
}

export function getStickersWithoutQuantity(
  stickers: Sticker[],
  collection: StickerCollection,
): Sticker[] {
  return stickers.filter(
    (sticker) => getStickerQuantity(collection, sticker.id) === 0,
  );
}

export const filterStickersMissing = getStickersWithoutQuantity;

export function getRepeatedStickers(
  stickers: Sticker[],
  collection: StickerCollection,
): Sticker[] {
  return stickers.filter(
    (sticker) => getStickerQuantity(collection, sticker.id) > 1,
  );
}

export function calculateCollectionSummary(
  stickers: Sticker[],
  collection: StickerCollection,
  totalStickers: number,
): CollectionSummary {
  const ownedCount = stickers.filter(
    (sticker) => getStickerQuantity(collection, sticker.id) > 0,
  ).length;

  const repeatedCount = Object.values(collection).reduce((total, quantity) => {
    return total + Math.max(quantity - 1, 0);
  }, 0);

  const missingCount = Math.max(totalStickers - ownedCount, 0);
  const completionPercentage =
    totalStickers > 0 ? Math.floor((ownedCount / totalStickers) * 100) : 0;

  return {
    ownedCount,
    missingCount,
    repeatedCount,
    completionPercentage,
  };
}

export function increaseCollectionQuantity(
  collection: StickerCollection,
  stickerId: number,
): StickerCollection {
  return {
    ...collection,
    [stickerId]: (collection[stickerId] ?? 0) + 1,
  };
}

export function applyStickerTradeToCollection(
  collection: StickerCollection,
  outgoingStickerIds: number[],
  incomingStickerIds: number[],
): StickerCollection {
  const updated = { ...collection };

  for (const id of outgoingStickerIds) {
    const currentQty = updated[id] ?? 0;

    if (currentQty > 1) {
      updated[id] = currentQty - 1;
    } else {
      delete updated[id];
    }
  }

  for (const id of incomingStickerIds) {
    updated[id] = (updated[id] ?? 0) + 1;
  }

  return updated;
}

export function getCompletedSelections(
  stickers: Sticker[],
  collection: StickerCollection,
): CompletedSelection[] {
  const teamStickers = new Map<
    string,
    { name: string; stickerIds: number[]; order: number }
  >();

  stickers.forEach((sticker, index) => {
    if (!sticker.team) {
      return;
    }

    const key = getSelectionKey(sticker.team);
    const current = teamStickers.get(key);

    if (current) {
      current.stickerIds.push(sticker.id);
      return;
    }

    teamStickers.set(key, {
      name: sticker.team.name,
      stickerIds: [sticker.id],
      order: index,
    });
  });

  return Array.from(teamStickers.entries())
    .filter(([, team]) =>
      team.stickerIds.every((id) => getStickerQuantity(collection, id) > 0),
    )
    .sort(([, first], [, second]) => first.order - second.order)
    .map(([key, team]) => ({
      key,
      name: team.name,
    }));
}

export function isAlbumComplete(
  stickers: Sticker[],
  collection: StickerCollection,
): boolean {
  return (
    stickers.length > 0 &&
    stickers.every((sticker) => getStickerQuantity(collection, sticker.id) > 0)
  );
}

export function getCollectionCompletionChange(
  stickers: Sticker[],
  previousCollection: StickerCollection,
  nextCollection: StickerCollection,
): {
  completedSelections: CompletedSelection[];
  albumCompleted: boolean;
} {
  const previousSelections = new Set(
    getCompletedSelections(stickers, previousCollection).map(
      (selection) => selection.key,
    ),
  );
  const nextSelections = getCompletedSelections(stickers, nextCollection);

  return {
    completedSelections: nextSelections.filter(
      (selection) => !previousSelections.has(selection.key),
    ),
    albumCompleted:
      !isAlbumComplete(stickers, previousCollection) &&
      isAlbumComplete(stickers, nextCollection),
  };
}

export function getStickerQuantity(
  collection: StickerCollection,
  stickerId: number,
): number {
  return collection[stickerId] ?? 0;
}

function getSelectionKey(team: StickerTeam): string {
  return String(team.id ?? team.albumCode ?? team.fifaCode ?? team.slug);
}

function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
