import { useMemo, useState } from "react";
import type { Sticker, StickerCollection } from "../../types/sticker";
import { calculateTradeSuggestion, formatTradeText } from "../../utils/trade";
import { useToast } from "../../hooks/useToast";
import { TradeConfirmModal } from "./TradeConfirmModal";
import "../../styles/trade-comparison.css";

type TradeComparisonProps = {
  myCollection: StickerCollection;
  theirCollection: StickerCollection;
  stickers: Sticker[];
  username: string;
  onClose: () => void;
  onConfirmTrade?: (giveIds: number[], receiveIds: number[]) => void;
};

export function TradeComparison({
  myCollection,
  theirCollection,
  stickers,
  username,
  onClose,
  onConfirmTrade,
}: TradeComparisonProps) {
  const { showToast } = useToast();
  const [showExtras, setShowExtras] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const suggestion = useMemo(() => {
    return calculateTradeSuggestion(myCollection, theirCollection, stickers);
  }, [myCollection, theirCollection, stickers]);

  async function copyComparison() {
    const text = formatTradeText(suggestion, username, showExtras, window.location.href);

    await navigator.clipboard.writeText(text);

    showToast({
      title: "Resultado copiado.",
      description: "Cole no WhatsApp para enviar.",
      variant: "success",
    });
  }

  function handleConfirmTrade() {
    if (!onConfirmTrade) return;

    setShowConfirmModal(true);
  }

  function handleModalConfirm() {
    if (!onConfirmTrade) return;

    const giveIds = suggestion.giveToThem.map((i) => i.stickerId);
    const receiveIds = suggestion.receiveFromThem.map((i) => i.stickerId);

    onConfirmTrade(giveIds, receiveIds);
    setShowConfirmModal(false);
    onClose();
  }

  const totalGive = suggestion.giveToThem.length + (showExtras ? suggestion.extrasForThem.length : 0);
  const totalReceive = suggestion.receiveFromThem.length + (showExtras ? suggestion.extrasForMe.length : 0);
  const imbalance = totalGive - totalReceive;

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

      <div className="trade-comparison__header">
        <h3 className="trade-comparison__main-title">Troca ideal</h3>
      </div>

      <div className="trade-comparison__content">
        <div className="trade-comparison__side">
          <h4 className="trade-comparison__title">Você entrega</h4>
          {suggestion.giveToThem.length === 0 ? (
            <p className="trade-comparison__empty">Nenhuma figurinha</p>
          ) : (
            <div className="trade-comparison__list">
              {suggestion.giveToThem.slice(0, 20).map((item) => (
                <span key={item.stickerId} className="trade-comparison__badge">
                  {item.displayCode}
                  {item.quantity > 1 && <span className="trade-comparison__qty">×{item.quantity}</span>}
                </span>
              ))}
              {suggestion.giveToThem.length > 20 && (
                <span className="trade-comparison__more">+{suggestion.giveToThem.length - 20}</span>
              )}
            </div>
          )}
        </div>

        <div className="trade-comparison__divider">
          <span>⇄</span>
        </div>

        <div className="trade-comparison__side">
          <h4 className="trade-comparison__title">Você recebe</h4>
          {suggestion.receiveFromThem.length === 0 ? (
            <p className="trade-comparison__empty">Nenhuma figurinha</p>
          ) : (
            <div className="trade-comparison__list">
              {suggestion.receiveFromThem.slice(0, 20).map((item) => (
                <span key={item.stickerId} className="trade-comparison__badge trade-comparison__badge--receive">
                  {item.displayCode}
                  {item.quantity > 1 && <span className="trade-comparison__qty">×{item.quantity}</span>}
                </span>
              ))}
              {suggestion.receiveFromThem.length > 20 && (
                <span className="trade-comparison__more">+{suggestion.receiveFromThem.length - 20}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {imbalance !== 0 && (
        <div className="trade-comparison__imbalance">
          <span className="trade-comparison__imbalance-text">
            {imbalance > 0
              ? `Diferença: você entrega ${imbalance} a mais`
              : `Diferença: você recebe ${Math.abs(imbalance)} a mais`}
          </span>
        </div>
      )}

      {(suggestion.extrasForMe.length > 0 || suggestion.extrasForThem.length > 0) && (
        <div className="trade-comparison__extras">
          <label className="trade-comparison__extras-toggle">
            <input
              type="checkbox"
              checked={showExtras}
              onChange={(e) => setShowExtras(e.target.checked)}
            />
            <span>Completar com repetidas extras</span>
          </label>

          {showExtras && (
            <div className="trade-comparison__extras-content">
              {imbalance > 0 && suggestion.extrasForMe.length > 0 && (
                <div className="trade-comparison__extras-section">
                  <span>Você recebe também:</span>
                  <div className="trade-comparison__list">
                    {suggestion.extrasForMe.slice(0, 10).map((item) => (
                      <span key={item.stickerId} className="trade-comparison__badge trade-comparison__badge--extra">
                        {item.displayCode}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {imbalance < 0 && suggestion.extrasForThem.length > 0 && (
                <div className="trade-comparison__extras-section">
                  <span>Você entrega também:</span>
                  <div className="trade-comparison__list">
                    {suggestion.extrasForThem.slice(0, 10).map((item) => (
                      <span key={item.stickerId} className="trade-comparison__badge trade-comparison__badge--extra">
                        {item.displayCode}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="trade-comparison__actions">
        <button
          type="button"
          className="trade-comparison__copy"
          onClick={copyComparison}
        >
          Copiar resultado
        </button>
        {onConfirmTrade && suggestion.giveToThem.length > 0 && (
          <button
            type="button"
            className="trade-comparison__confirm"
            onClick={handleConfirmTrade}
          >
            Confirmar troca
          </button>
        )}
      </div>

      {showConfirmModal && (
        <TradeConfirmModal
          giveItems={suggestion.giveToThem}
          receiveItems={suggestion.receiveFromThem}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
}