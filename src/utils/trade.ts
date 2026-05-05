import type { Sticker, StickerCollection, TradeItem, TradeSuggestion } from "../types/sticker";

export function calculateTradeSuggestion(
  myCollection: StickerCollection,
  theirCollection: StickerCollection,
  stickers: Sticker[]
): TradeSuggestion {
  const giveToThem: TradeItem[] = [];
  const receiveFromThem: TradeItem[] = [];
  const extrasForMe: TradeItem[] = [];
  const extrasForThem: TradeItem[] = [];

  const stickerMap = new Map<number, Sticker>();
  stickers.forEach((s) => stickerMap.set(s.id, s));

  stickers.forEach((sticker) => {
    const myQty = myCollection[sticker.id] ?? 0;
    const theirQty = theirCollection[sticker.id] ?? 0;

    const myAvailable = Math.max(myQty - 1, 0);
    const theirAvailable = Math.max(theirQty - 1, 0);

    const theyNeed = theirQty === 0;
    const iNeed = myQty === 0;

    if (myAvailable > 0 && theyNeed) {
      giveToThem.push({
        stickerId: sticker.id,
        displayCode: sticker.displayCode,
        quantity: myAvailable,
        playerName: sticker.playerName,
        teamName: sticker.team?.name,
        isExtra: false,
      });
    }

    if (theirAvailable > 0 && iNeed) {
      receiveFromThem.push({
        stickerId: sticker.id,
        displayCode: sticker.displayCode,
        quantity: theirAvailable,
        playerName: sticker.playerName,
        teamName: sticker.team?.name,
        isExtra: false,
      });
    }

    if (myAvailable > 0 && !theyNeed) {
      extrasForThem.push({
        stickerId: sticker.id,
        displayCode: sticker.displayCode,
        quantity: myAvailable,
        playerName: sticker.playerName,
        teamName: sticker.team?.name,
        isExtra: true,
      });
    }

    if (theirAvailable > 0 && !iNeed) {
      extrasForMe.push({
        stickerId: sticker.id,
        displayCode: sticker.displayCode,
        quantity: theirAvailable,
        playerName: sticker.playerName,
        teamName: sticker.team?.name,
        isExtra: true,
      });
    }
  });

  const giveCount = giveToThem.length;
  const receiveCount = receiveFromThem.length;
  const imbalance = giveCount - receiveCount;

  return {
    giveToThem,
    receiveFromThem,
    extrasForMe,
    extrasForThem,
    imbalance,
  };
}

export function formatTradeText(
  suggestion: TradeSuggestion,
  username: string,
  includeExtras: boolean,
  url: string
): string {
  const giveList = suggestion.giveToThem.map((i) => i.displayCode).join(", ") || "nada";
  const receiveList = suggestion.receiveFromThem.map((i) => i.displayCode).join(", ") || "nada";

  let text = `Minha coleção vs ${username}\n\n🎁 Eu te passo: ${giveList}\n\n📥 Você me passa: ${receiveList}`;

  if (includeExtras) {
    const extrasForThemList = suggestion.extrasForThem
      .slice(0, 10)
      .map((i) => i.displayCode)
      .join(", ");
    const extrasForMeList = suggestion.extrasForMe
      .slice(0, 10)
      .map((i) => i.displayCode)
      .join(", ");

    if (extrasForThemList || extrasForMeList) {
      text += "\n\n+ Extras para equilibrar:";
      if (extrasForThemList) {
        text += `\nVocê pode me dar: ${extrasForThemList}`;
      }
      if (extrasForMeList) {
        text += `\nEu posso te dar: ${extrasForMeList}`;
      }
    }
  }

  text += `\n\n🔗 Ver: ${url}`;

  return text;
}