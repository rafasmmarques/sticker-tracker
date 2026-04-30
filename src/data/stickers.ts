import type { Sticker } from "../types/sticker";

export const TOTAL_STICKERS = 980;

export const stickers: Sticker[] = Array.from(
  { length: TOTAL_STICKERS },
  (_, index) => {
    const number = index + 1;

    return {
      id: number,
      code: number.toString().padStart(3, "0"),
    };
  }
);
