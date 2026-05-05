import { useMemo, useState } from "react";
import type { Sticker, StickerCollection, TradeItem } from "../../types/sticker";
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

function renderBadge(item: TradeItem) {
  const classes = [
    "trade-comparison__badge",
    item.isSpecial && "trade-comparison__badge--special",
    item.isExtra && "trade-comparison__badge--extra",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span key={item.stickerId} className={classes}>
      {item.isSpecial && <span className="trade-comparison__star">⭐</span>}
      {item.displayCode}
      {item.quantity > 1 && <span className="trade-comparison__qty">×{item.quantity}</span>}
    </span>
  );
}

function renderItemList(items: TradeItem[], maxItems: number, emptyMessage: string) {
  if (items.length === 0) {
    return <p className="trade-comparison__empty">{emptyMessage}</p>;
  }

  return (
    <>
      <div className="trade-comparison__list">
        {items.slice(0, maxItems).map(renderBadge)}
        {items.length > maxItems && (
          <span className="trade-comparison__more">+{items.length - maxItems}</span>
        )}
      </div>
    </>
  );
}

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

  const giveNormal = useMemo(
    () => suggestion.giveToThem.filter((i) => !i.isSpecial),
    [suggestion]
  );
  const giveSpecial = useMemo(
    () => suggestion.giveToThem.filter((i) => i.isSpecial),
    [suggestion]
  );
  const receiveNormal = useMemo(
    () => suggestion.receiveFromThem.filter((i) => !i.isSpecial),
    [suggestion]
  );
  const receiveSpecial = useMemo(
    () => suggestion.receiveFromThem.filter((i) => i.isSpecial),
    [suggestion]
  );

  const hasSpecials =
    giveSpecial.length > 0 ||
    receiveSpecial.length > 0 ||
    suggestion.extrasForMe.some((i) => i.isSpecial) ||
    suggestion.extrasForThem.some((i) => i.isSpecial);

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

  const totalGive =
    suggestion.giveToThem.length + (showExtras ? suggestion.extrasForThem.length : 0);
  const totalReceive =
    suggestion.receiveFromThem.length + (showExtras ? suggestion.extrasForMe.length : 0);
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
          {giveNormal.length === 0 && giveSpecial.length === 0 ? (
            <p className="trade-comparison__empty">Nenhuma figurinha</p>
          ) : (
            <>
              {giveNormal.length > 0 && (
                <>
                  <span className="trade-comparison__group-label">Normais</span>
                  {renderItemList(giveNormal, 15, "")}
                </>
              )}
              {giveSpecial.length > 0 && (
                <>
                  <span className="trade-comparison__group-label">⭐ Especiais</span>
                  {renderItemList(giveSpecial, 10, "")}
                </>
              )}
            </>
          )}
        </div>

        <div className="trade-comparison__divider">
          <span>⇄</span>
        </div>

        <div className="trade-comparison__side">
          <h4 className="trade-comparison__title">Você recebe</h4>
          {receiveNormal.length === 0 && receiveSpecial.length === 0 ? (
            <p className="trade-comparison__empty">Nenhuma figurinha</p>
          ) : (
            <>
              {receiveNormal.length > 0 && (
                <>
                  <span className="trade-comparison__group-label">Normais</span>
                  {renderItemList(receiveNormal, 15, "")}
                </>
              )}
              {receiveSpecial.length > 0 && (
                <>
                  <span className="trade-comparison__group-label">⭐ Especiais</span>
                  {renderItemList(receiveSpecial, 10, "")}
                </>
              )}
            </>
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
                  <span>Você recebe também (⭐):</span>
                  <div className="trade-comparison__list">
                    {suggestion.extrasForMe.slice(0, 10).map(renderBadge)}
                  </div>
                </div>
              )}
              {imbalance < 0 && suggestion.extrasForThem.length > 0 && (
                <div className="trade-comparison__extras-section">
                  <span>Você entrega também (⭐):</span>
                  <div className="trade-comparison__list">
                    {suggestion.extrasForThem.slice(0, 10).map(renderBadge)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {hasSpecials && (
        <div className="trade-comparison__legend">
          <span>⭐ = Especial</span>
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