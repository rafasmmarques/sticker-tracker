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

  stickers.forEach((sticker) => {
    const myQty = myCollection[sticker.id] ?? 0;
    const theirQty = theirCollection[sticker.id] ?? 0;

    const myAvailable = Math.max(myQty - 1, 0);
    const theirAvailable = Math.max(theirQty - 1, 0);

    const theyNeed = theirQty === 0;
    const iNeed = myQty === 0;
    const isSpecial = sticker.isSpecial || sticker.specialFinish !== null;

    const baseItem = (available: number): TradeItem => ({
      stickerId: sticker.id,
      displayCode: sticker.displayCode,
      quantity: available,
      playerName: sticker.playerName,
      teamName: sticker.team?.name,
      isSpecial,
      isExtra: false,
    });

    const extraItem = (available: number): TradeItem => ({
      stickerId: sticker.id,
      displayCode: sticker.displayCode,
      quantity: available,
      playerName: sticker.playerName,
      teamName: sticker.team?.name,
      isSpecial,
      isExtra: true,
    });

    if (myAvailable > 0 && theyNeed) {
      giveToThem.push(baseItem(myAvailable));
    }

    if (theirAvailable > 0 && iNeed) {
      receiveFromThem.push(baseItem(theirAvailable));
    }

    if (myAvailable > 0 && !theyNeed) {
      extrasForThem.push(extraItem(myAvailable));
    }

    if (theirAvailable > 0 && !iNeed) {
      extrasForMe.push(extraItem(theirAvailable));
    }
  });

  const giveNormal = giveToThem.filter((i) => !i.isSpecial);
  const giveSpecial = giveToThem.filter((i) => i.isSpecial);
  const receiveNormal = receiveFromThem.filter((i) => !i.isSpecial);
  const receiveSpecial = receiveFromThem.filter((i) => i.isSpecial);

  const extrasForMeSpecial = extrasForMe.filter((i) => i.isSpecial);
  const extrasForThemSpecial = extrasForThem.filter((i) => i.isSpecial);

  const imbalanceNormal = giveNormal.length - receiveNormal.length;
  const imbalanceSpecial = giveSpecial.length + extrasForThemSpecial.length - (receiveSpecial.length + extrasForMeSpecial.length);

  const finalGiveToThem = [
    ...giveNormal,
    ...giveSpecial,
  ];

  const finalReceiveFromThem = [
    ...receiveNormal,
    ...receiveSpecial,
  ];

  let usedExtrasForMe: TradeItem[] = [];
  let usedExtrasForThem: TradeItem[] = [];

  if (imbalanceNormal > 0 && extrasForMeSpecial.length > 0) {
    const needed = Math.min(imbalanceNormal, extrasForMeSpecial.length);
    usedExtrasForMe = extrasForMeSpecial.slice(0, needed);
  } else if (imbalanceNormal < 0 && extrasForThemSpecial.length > 0) {
    const needed = Math.min(Math.abs(imbalanceNormal), extrasForThemSpecial.length);
    usedExtrasForThem = extrasForThemSpecial.slice(0, needed);
  }

  if (imbalanceSpecial > 0 && extrasForMeSpecial.length > 0) {
    const needed = Math.min(imbalanceSpecial, extrasForMeSpecial.length);
    const newExtras = extrasForMeSpecial.slice(0, needed);
    const notUsed = new Set(newExtras.map((e) => e.stickerId));
    usedExtrasForMe = [...usedExtrasForMe, ...newExtras];
    usedExtrasForThem = usedExtrasForThem.filter((e) => !notUsed.has(e.stickerId));
  } else if (imbalanceSpecial < 0 && extrasForThemSpecial.length > 0) {
    const needed = Math.min(Math.abs(imbalanceSpecial), extrasForThemSpecial.length);
    const newExtras = extrasForThemSpecial.slice(0, needed);
    const notUsed = new Set(newExtras.map((e) => e.stickerId));
    usedExtrasForThem = [...usedExtrasForThem, ...newExtras];
    usedExtrasForMe = usedExtrasForMe.filter((e) => !notUsed.has(e.stickerId));
  }

  return {
    giveToThem: finalGiveToThem,
    receiveFromThem: finalReceiveFromThem,
    extrasForMe: usedExtrasForMe,
    extrasForThem: usedExtrasForThem,
    imbalance: finalGiveToThem.length + usedExtrasForThem.length - (finalReceiveFromThem.length + usedExtrasForMe.length),
  };
}

export function formatTradeText(
  suggestion: TradeSuggestion,
  username: string,
  includeExtras: boolean,
  url: string
): string {
  const giveNormal = suggestion.giveToThem.filter((i) => !i.isSpecial);
  const giveSpecial = suggestion.giveToThem.filter((i) => i.isSpecial);
  const receiveNormal = suggestion.receiveFromThem.filter((i) => !i.isSpecial);
  const receiveSpecial = suggestion.receiveFromThem.filter((i) => i.isSpecial);

  const formatList = (items: TradeItem[]) => items.map((i) => i.displayCode).join(", ") || "nada";

  let text = `Minha coleção vs ${username}\n\n🎁 Eu te passo:`;
  if (giveNormal.length > 0) text += `\nNormais: ${formatList(giveNormal)}`;
  if (giveSpecial.length > 0) text += `\n⭐ Especiais: ${formatList(giveSpecial)}`;

  text += `\n\n📥 Você me passa:`;
  if (receiveNormal.length > 0) text += `\nNormais: ${formatList(receiveNormal)}`;
  if (receiveSpecial.length > 0) text += `\n⭐ Especiais: ${formatList(receiveSpecial)}`;

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
      if (extrasForThemList) text += `\n⭐ Você pode me dar: ${extrasForThemList}`;
      if (extrasForMeList) text += `\n⭐ Eu posso te dar: ${extrasForMeList}`;
    }
  }

  text += `\n\n🔗 Ver: ${url}`;
  return text;
}