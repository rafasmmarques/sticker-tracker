import { useMemo } from "react";
import type { Sticker, StickerCollection } from "../../types/sticker";
import { getStickerQuantity } from "../../utils/collection";
import { useToast } from "../../hooks/useToast";
import "../../styles/trade-comparison.css";

type TradeComparisonProps = {
  myCollection: StickerCollection;
  theirCollection: StickerCollection;
  stickers: Sticker[];
  username: string;
  onClose: () => void;
};

export function TradeComparison({
  myCollection,
  theirCollection,
  stickers,
  username,
  onClose,
}: TradeComparisonProps) {
  const { showToast } = useToast();

  const result = useMemo(() => {
    const youCanOffer: Sticker[] = [];
    const youCanRequest: Sticker[] = [];

    const myRepeated = new Set<number>();
    const theirRepeated = new Set<number>();
    const theyNeed = new Set<number>();
    const iNeed = new Set<number>();

    stickers.forEach((sticker) => {
      const myQty = getStickerQuantity(myCollection, sticker.id);
      const theirQty = getStickerQuantity(theirCollection, sticker.id);

      if (myQty > 1) {
        myRepeated.add(sticker.id);
      }
      if (theirQty > 1) {
        theirRepeated.add(sticker.id);
      }
      if (theirQty === 0) {
        theyNeed.add(sticker.id);
      }
      if (myQty === 0) {
        iNeed.add(sticker.id);
      }
    });

    stickers.forEach((sticker) => {
      const id = sticker.id;

      if (myRepeated.has(id) && theyNeed.has(id)) {
        youCanOffer.push(sticker);
      }

      if (theirRepeated.has(id) && iNeed.has(id)) {
        youCanRequest.push(sticker);
      }
    });

    return { youCanOffer, youCanRequest };
  }, [myCollection, theirCollection, stickers]);

  const offerText = result.youCanOffer
    .map((s) => s.displayCode)
    .join(", ");
  const requestText = result.youCanRequest
    .map((s) => s.displayCode)
    .join(", ");

  async function copyComparison() {
    const text = `Minha coleção vs ${username}\n\n🎁 Eu te passo: ${offerText || "nada"}\n\n📥 Você me passa: ${requestText || "nada"}\n\n🔗 Ver: ${window.location.href}`;

    await navigator.clipboard.writeText(text);

    showToast({
      title: "Resultado copiado.",
      description: "Cole no WhatsApp para enviar.",
      variant: "success",
    });
  }

  return (
    <div className="trade-comparison">
      <button
        type="button"
        className="trade-comparison__close"
        onClick={onClose}
        aria-label="Fechar comparação"
      >
        ×
      </button>

      <div className="trade-comparison__content">
        <div className="trade-comparison__side">
          <h3 className="trade-comparison__title">
            🎁 Você pode oferecer
          </h3>
          <p className="trade-comparison__subtitle">
            Suas repetidas que {username} precisa
          </p>
          {result.youCanOffer.length === 0 ? (
            <p className="trade-comparison__empty">Nenhuma oferta possível</p>
          ) : (
            <div className="trade-comparison__list">
              {result.youCanOffer.slice(0, 30).map((sticker) => (
                <span
                  key={sticker.id}
                  className="trade-comparison__badge"
                >
                  {sticker.displayCode}
                </span>
              ))}
              {result.youCanOffer.length > 30 && (
                <span className="trade-comparison__more">
                  +{result.youCanOffer.length - 30}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="trade-comparison__divider">
          <span>⇄</span>
        </div>

        <div className="trade-comparison__side">
          <h3 className="trade-comparison__title">
            📥 Você pode pedir
          </h3>
          <p className="trade-comparison__subtitle">
            Repetidas de {username} que você precisa
          </p>
          {result.youCanRequest.length === 0 ? (
            <p className="trade-comparison__empty">
              Nenhuma solicitação possível
            </p>
          ) : (
            <div className="trade-comparison__list">
              {result.youCanRequest.slice(0, 30).map((sticker) => (
                <span
                  key={sticker.id}
                  className="trade-comparison__badge"
                >
                  {sticker.displayCode}
                </span>
              ))}
              {result.youCanRequest.length > 30 && (
                <span className="trade-comparison__more">
                  +{result.youCanRequest.length - 30}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        className="trade-comparison__copy"
        onClick={copyComparison}
      >
        Copiar resultado
      </button>
    </div>
  );
}