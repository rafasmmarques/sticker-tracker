export type StickerTeam = {
  id: number;
  slug: string;
  name: string;
  fifaCode?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
};

export type StickerType = {
  id: number;
  slug: string;
  name: string;
  isSpecial: boolean;
};

export type Sticker = {
  id: number;
  code: string;
  number: number;
  playerName?: string | null;
  playerPosition?: string | null;
  isSpecial: boolean;
  specialFinish?: string | null;
  section?: string | null;
  pageNumber?: number | null;
  displayOrder: number;
  team?: StickerTeam | null;
  type?: StickerType | null;
};

export type StickerCollection = Record<number, number>;

export type CollectionSummary = {
  ownedCount: number;
  missingCount: number;
  repeatedCount: number;
  completionPercentage: number;
};
