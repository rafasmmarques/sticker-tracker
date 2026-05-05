import type { Sticker, StickerCollection, TradeItem, TradeSuggestion } from "../types/sticker";

export function calculateTradeSuggestion(
  myCollection: StickerCollection,
  theirCollection: StickerCollection,
  stickers: Sticker[]
): TradeSuggestion {
  const giveNormal: TradeItem[] = [];
  const giveSpecial: TradeItem[] = [];
  const receiveNormalCandidate: TradeItem[] = [];
  const receiveSpecialCandidate: TradeItem[] = [];
  const allExtrasForMe: TradeItem[] = [];
  const allExtrasForThem: TradeItem[] = [];

  stickers.forEach((sticker) => {
    const myQty = myCollection[sticker.id] ?? 0;
    const theirQty = theirCollection[sticker.id] ?? 0;

    const myAvailable = Math.max(myQty - 1, 0);
    const theirAvailable = Math.max(theirQty - 1, 0);

    const theyNeed = theirQty === 0;
    const iNeed = myQty === 0;
    const isSpecial = sticker.isSpecial || sticker.specialFinish !== null;

    const createItem = (available: number, isExtra: boolean): TradeItem => ({
      stickerId: sticker.id,
      displayCode: sticker.displayCode,
      quantity: available,
      playerName: sticker.playerName,
      teamName: sticker.team?.name,
      isSpecial,
      isExtra,
    });

    if (myAvailable > 0 && theyNeed) {
      if (isSpecial) {
        giveSpecial.push(createItem(myAvailable, false));
      } else {
        giveNormal.push(createItem(myAvailable, false));
      }
    }

    if (theirAvailable > 0 && iNeed) {
      if (isSpecial) {
        receiveSpecialCandidate.push(createItem(theirAvailable, false));
      } else {
        receiveNormalCandidate.push(createItem(theirAvailable, false));
      }
    }

    if (myAvailable > 0 && !theyNeed) {
      allExtrasForThem.push(createItem(myAvailable, true));
    }

    if (theirAvailable > 0 && !iNeed) {
      allExtrasForMe.push(createItem(theirAvailable, true));
    }
  });

  const balancedGiveNormal = giveNormal;
  const balancedGiveSpecial = giveSpecial;

  const balancedReceiveNormal = receiveNormalCandidate.slice(0, balancedGiveNormal.length);
  const balancedReceiveSpecial = receiveSpecialCandidate.slice(0, balancedGiveSpecial.length);

  const totalGive = balancedGiveNormal.length + balancedGiveSpecial.length;
  const totalReceive = balancedReceiveNormal.length + balancedReceiveSpecial.length;
  const imbalance = totalGive - totalReceive;

  const balancedReceive = [...balancedReceiveNormal, ...balancedReceiveSpecial];

  let extrasForMe: TradeItem[] = [];
  let extrasForThem: TradeItem[] = [];

  if (imbalance > 0) {
    const needed = Math.min(imbalance, allExtrasForMe.length);
    extrasForMe = allExtrasForMe.slice(0, needed);
  } else if (imbalance < 0) {
    const needed = Math.min(Math.abs(imbalance), allExtrasForThem.length);
    extrasForThem = allExtrasForThem.slice(0, needed);
  }

  const finalGiveToThem = [...balancedGiveNormal, ...balancedGiveSpecial];
  const finalReceiveFromThem = [...balancedReceive];

  return {
    giveToThem: finalGiveToThem,
    receiveFromThem: finalReceiveFromThem,
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