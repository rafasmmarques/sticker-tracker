export type Sticker = {
  id: number;
  code: string;
};

export type StickerCollection = Record<number, number>;

export type CollectionSummary = {
  ownedCount: number;
  missingCount: number;
  repeatedCount: number;
  completionPercentage: number;
};
