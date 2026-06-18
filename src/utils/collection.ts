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

export function parseImportedStickerCodes(importText: string): string[] {
  const codes = new Set<string>();
  const lines = importText
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const cleanLine = stripImportListPrefix(line);
    const groupedMatch = cleanLine.match(/^([a-z0-9]{2,4})\s*:\s*(.+)$/i);

    if (groupedMatch) {
      const [, groupCode, numberList] = groupedMatch;
      const stickerNumbers = numberList.match(/\d{1,3}/g) ?? [];

      for (const stickerNumber of stickerNumbers) {
        codes.add(`${groupCode.toUpperCase()} ${Number(stickerNumber)}`);
      }

      continue;
    }

    for (const match of cleanLine.matchAll(/\b([a-z]{2,4})\s*-?\s*(\d{1,3})\b/gi)) {
      const [, groupCode, stickerNumber] = match;
      codes.add(`${groupCode.toUpperCase()} ${Number(stickerNumber)}`);
    }
  }

  return Array.from(codes);
}

export function normalizeStickerCode(value: string): string {
  return value.toUpperCase().replace(/[-\s]/g, "");
}

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
  return getCompletionStickers(stickers).filter(
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
): CollectionSummary {
  const completionStickers = getCompletionStickers(stickers);
  const totalStickers = stickers.length;
  const totalCompletionStickers = completionStickers.length;
  const totalOwnedCount = stickers.filter(
    (sticker) => getStickerQuantity(collection, sticker.id) > 0,
  ).length;
  const ownedCount = completionStickers.filter(
    (sticker) => getStickerQuantity(collection, sticker.id) > 0,
  ).length;

  const repeatedCount = completionStickers.reduce((total, sticker) => {
    return total + Math.max(getStickerQuantity(collection, sticker.id) - 1, 0);
  }, 0);

  const missingCount = Math.max(totalCompletionStickers - ownedCount, 0);
  const completionPercentage =
    totalCompletionStickers > 0
      ? Math.floor((ownedCount / totalCompletionStickers) * 100)
      : 0;

  return {
    ownedCount,
    missingCount,
    repeatedCount,
    completionPercentage,
    totalOwnedCount,
    totalStickers,
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

  getCompletionStickers(stickers).forEach((sticker, index) => {
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
  const completionStickers = getCompletionStickers(stickers);

  return (
    completionStickers.length > 0 &&
    completionStickers.every(
      (sticker) => getStickerQuantity(collection, sticker.id) > 0,
    )
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

export function getCompletionStickers(stickers: Sticker[]): Sticker[] {
  return stickers.filter((sticker) => sticker.countsForCompletion);
}

function getSelectionKey(team: StickerTeam): string {
  return String(team.id ?? team.albumCode ?? team.fifaCode ?? team.slug);
}

function stripImportListPrefix(line: string): string {
  return line.replace(
    /^figurinhas\s+(?:que\s+faltam|repetidas)\s+na\s+minha\s+cole[cç][aã]o\s*:\s*/i,
    "",
  );
}

function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
