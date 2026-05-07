import { useMemo, useState } from "react";
import type { Sticker, StickerCollection, TradeItem } from "../../types/sticker";
import { calculateTradeSuggestion, formatTradeText } from "../../utils/trade";
import { showToast } from "../../utils/toast";
import { TradeConfirmModal } from "./TradeConfirmModal";

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
    "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-semibold",
    item.isSpecial ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white" : "bg-blue-100 text-blue-800",
    item.isExtra && "bg-gray-200 text-gray-600",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span key={item.stickerId} className={classes}>
      {item.isSpecial && <span className="text-[10px]">⭐</span>}
      {item.displayCode}
      {item.quantity > 1 && <span className="text-[10px] ml-0.5 opacity-80">×{item.quantity}</span>}
    </span>
  );
}

function renderItemList(items: TradeItem[], maxItems: number, emptyMessage: string) {
  if (items.length === 0) {
    return <p className="m-0 p-3 bg-[#f4f5ef] rounded-lg text-sm text-center text-[#667085]">{emptyMessage}</p>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-1">
        {items.slice(0, maxItems).map(renderBadge)}
        {items.length > maxItems && (
          <span className="inline-block px-1.5 py-0.5 text-xs text-[#667085]">+{items.length - maxItems}</span>
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
    showToast({
      title: "Troca registrada!",
      description: "Sua coleção foi atualizada.",
      variant: "success",
    });
  }

  const totalGive =
    suggestion.giveToThem.length + (showExtras ? suggestion.extrasForThem.length : 0);
  const totalReceive =
    suggestion.receiveFromThem.length + (showExtras ? suggestion.extrasForMe.length : 0);
  const imbalance = totalGive - totalReceive;

  return (
    <div className="relative bg-white rounded-2xl p-4 sm:p-5 shadow-lg max-h-[90vh] overflow-y-auto">
      <button
        type="button"
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-[#f4f5ef] rounded-full text-xl text-[#667085] hover:bg-gray-200 z-10"
        onClick={onClose}
        aria-label="Fechar comparação"
      >
        ×
      </button>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-center text-[var(--color-ink)]">Troca ideal</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start mb-4">
        <div className="flex-1 min-w-0 w-full">
          <h4 className="text-[15px] font-semibold text-[#171b5f] mb-1">Você entrega</h4>
          {giveNormal.length === 0 && giveSpecial.length === 0 ? (
            <p className="m-0 p-3 bg-[#f4f5ef] rounded-lg text-sm text-center text-[#667085]">Nenhuma figurinha</p>
          ) : (
            <>
              {giveNormal.length > 0 && (
                <>
                  <span className="block text-xs font-semibold text-[#667085] mt-2 mb-1">Normais</span>
                  {renderItemList(giveNormal, 15, "")}
                </>
              )}
              {giveSpecial.length > 0 && (
                <>
                  <span className="block text-xs font-semibold text-[#667085] mt-2 mb-1">⭐ Especiais</span>
                  {renderItemList(giveSpecial, 10, "")}
                </>
              )}
            </>
          )}
        </div>

        <div className="hidden md:flex items-center justify-center w-8 flex-shrink-0">
          <span className="text-2xl text-red-600">⇄</span>
        </div>
        
        <div className="flex md:hidden items-center justify-center py-1 w-full">
          <span className="text-xl text-red-600 rotate-90">⇄</span>
        </div>

        <div className="flex-1 min-w-0 w-full">
          <h4 className="text-[15px] font-semibold text-[#171b5f] mb-1">Você recebe</h4>
          {receiveNormal.length === 0 && receiveSpecial.length === 0 ? (
            <p className="m-0 p-3 bg-[#f4f5ef] rounded-lg text-sm text-center text-[#667085]">Nenhuma figurinha</p>
          ) : (
            <>
              {receiveNormal.length > 0 && (
                <>
                  <span className="block text-xs font-semibold text-[#667085] mt-2 mb-1">Normais</span>
                  {renderItemList(receiveNormal, 15, "")}
                </>
              )}
              {receiveSpecial.length > 0 && (
                <>
                  <span className="block text-xs font-semibold text-[#667085] mt-2 mb-1">⭐ Especiais</span>
                  {renderItemList(receiveSpecial, 10, "")}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {imbalance !== 0 && (
        <div className="text-center py-2 bg-amber-100 rounded-lg mb-3">
          <span className="text-sm font-semibold text-amber-800">
            {imbalance > 0
              ? `Diferença: você entrega ${imbalance} a mais`
              : `Diferença: você recebe ${Math.abs(imbalance)} a mais`}
          </span>
        </div>
      )}

      {(suggestion.extrasForMe.length > 0 || suggestion.extrasForThem.length > 0) && (
        <div className="mb-3">
          <label className="flex items-center gap-2 text-sm text-[#171b5f] cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-[#171b5f]"
              checked={showExtras}
              onChange={(e) => setShowExtras(e.target.checked)}
            />
            <span>Completar com repetidas extras</span>
          </label>

          {showExtras && (
            <div className="mt-2 p-3 bg-slate-50 rounded-lg">
              {imbalance > 0 && suggestion.extrasForMe.length > 0 && (
                <div className="mb-2">
                  <span className="block text-xs text-[#667085] mb-1.5">Você recebe também (⭐):</span>
                  <div className="flex flex-wrap gap-1">
                    {suggestion.extrasForMe.slice(0, 10).map(renderBadge)}
                  </div>
                </div>
              )}
              {imbalance < 0 && suggestion.extrasForThem.length > 0 && (
                <div className="mb-2">
                  <span className="block text-xs text-[#667085] mb-1.5">Você entrega também (⭐):</span>
                  <div className="flex flex-wrap gap-1">
                    {suggestion.extrasForThem.slice(0, 10).map(renderBadge)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {hasSpecials && (
        <div className="flex justify-center gap-4 py-3 text-xs text-[#667085] border-t mt-3">
          <span>⭐ = Especial</span>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          className="w-full py-3 bg-[#171b5f] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition active:scale-[0.98]"
          onClick={copyComparison}
        >
          Copiar resultado
        </button>
        {onConfirmTrade && suggestion.giveToThem.length > 0 && (
          <button
            type="button"
            className="flex-1 py-3 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition active:scale-[0.98]"
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