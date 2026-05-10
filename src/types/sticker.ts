export type StickerTeam = {
  id: number;
  slug: string;
  name: string;
  countryCode?: string | null;
  fifaCode?: string | null;
  albumCode?: string | null;
  groupLetter?: string | null;
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

export type StickerGroup = {
  id: number;
  code: string;
  name: string;
  type: string;
  displayOrder: number;
};

export type Sticker = {
  id: number;
  code: string;
  number: number;
  albumCode: string;
  groupCode: string;
  numberInGroup: number;
  displayCode: string;
  playerName?: string | null;
  playerPosition?: string | null;
  isSpecial: boolean;
  specialFinish?: string | null;
  countsForCompletion: boolean;
  section?: string | null;
  pageNumber?: number | null;
  displayOrder: number;
  team?: StickerTeam | null;
  group?: StickerGroup | null;
  type?: StickerType | null;
};

export type StickerCollection = Record<number, number>;

export type CollectionSummary = {
  ownedCount: number;
  missingCount: number;
  repeatedCount: number;
  completionPercentage: number;
};

export type Profile = {
  id: string;
  username: string | null;
  displayName: string | null;
  linkAtivo: boolean;
  createdAt: string;
};

export type PublicProfile = {
  id: string;
  username: string;
  linkAtivo: boolean;
};

export type TradeItem = {
  stickerId: number;
  displayCode: string;
  quantity: number;
  playerName?: string | null;
  teamName?: string | null;
  isSpecial: boolean;
  isExtra: boolean;
};

export type TradeSuggestion = {
  giveToThem: TradeItem[];
  receiveFromThem: TradeItem[];
  extrasForMe: TradeItem[];
  extrasForThem: TradeItem[];
  imbalance: number;
};
