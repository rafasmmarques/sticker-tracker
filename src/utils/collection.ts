import type {
  CollectionSummary,
  Sticker,
  StickerCollection,
} from "../types/sticker";

export function filterStickersByCode(
  stickers: Sticker[],
  search: string
): Sticker[] {
  const normalizedSearch = normalizeSearch(search);

  if (!normalizedSearch) {
    return stickers;
  }

  return stickers.filter((sticker) => {
    const searchableContent = [
      sticker.code,
      sticker.number.toString(),
      sticker.playerName,
      sticker.playerPosition,
      sticker.team?.name,
      sticker.team?.fifaCode,
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
  collection: StickerCollection
): Sticker[] {
  return stickers.filter(
    (sticker) => getStickerQuantity(collection, sticker.id) === 0
  );
}

export function calculateCollectionSummary(
  stickers: Sticker[],
  collection: StickerCollection,
  totalStickers: number
): CollectionSummary {
  const ownedCount = stickers.filter(
    (sticker) => getStickerQuantity(collection, sticker.id) > 0
  ).length;

  const repeatedCount = Object.values(collection).reduce((total, quantity) => {
    return total + Math.max(quantity - 1, 0);
  }, 0);

  const missingCount = Math.max(totalStickers - ownedCount, 0);
  const completionPercentage =
    totalStickers > 0 ? Math.round((ownedCount / totalStickers) * 100) : 0;

  return {
    ownedCount,
    missingCount,
    repeatedCount,
    completionPercentage,
  };
}

export function getStickerQuantity(
  collection: StickerCollection,
  stickerId: number
): number {
  return collection[stickerId] ?? 0;
}

function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
