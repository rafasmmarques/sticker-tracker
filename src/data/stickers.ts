import type { Sticker } from "../types/sticker";

export const TOTAL_STICKERS = 980;

export const stickers: Sticker[] = Array.from(
  { length: TOTAL_STICKERS },
  (_, index) => {
    const number = index + 1;

    return {
      id: number,
      code: number.toString().padStart(3, "0"),
      number,
      playerName: null,
      playerPosition: null,
      isSpecial: false,
      specialFinish: null,
      section: null,
      pageNumber: null,
      displayOrder: number,
      team: null,
      type: {
        id: 1,
        slug: "player_base",
        name: "Jogador",
        isSpecial: false,
      },
    };
  }
);
