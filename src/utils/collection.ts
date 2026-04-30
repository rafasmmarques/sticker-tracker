import type {
  CollectionSummary,
  Sticker,
  StickerCollection,
} from "../types/sticker";

export function filterStickersByCode(
  stickers: Sticker[],
  search: string
): Sticker[] {
  const normalizedSearch = search.trim();

  if (!normalizedSearch) {
    return stickers;
  }

  return stickers.filter((sticker) => sticker.code.includes(normalizedSearch));
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

  const missingCount = totalStickers - ownedCount;
  const completionPercentage = Math.round((ownedCount / totalStickers) * 100);

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
