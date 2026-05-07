import type { TradeItem } from "../../types/sticker";

type TradeConfirmModalProps = {
  giveItems: TradeItem[];
  receiveItems: TradeItem[];
  onCancel: () => void;
  onConfirm: () => void;
};

export function TradeConfirmModal({
  giveItems,
  receiveItems,
  onCancel,
  onConfirm,
}: TradeConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onCancel}>
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-center mb-5 text-[var(--color-ink)]">Confirmar troca</h3>

        <div className="mb-4">
          <h4 className="text-sm font-bold text-[var(--color-muted)] mb-2">Você vai DAR:</h4>
          <div className="flex flex-wrap gap-1.5">
            {giveItems.map((item) => (
              <span key={item.stickerId} className="inline-block px-2.5 py-1 bg-[var(--color-border)] rounded-md text-sm font-semibold text-[var(--color-ink)]">
                {item.displayCode}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-bold text-[var(--color-muted)] mb-2">Você vai RECEBER:</h4>
          <div className="flex flex-wrap gap-1.5">
            {receiveItems.map((item) => (
              <span key={item.stickerId} className="inline-block px-2.5 py-1 bg-[var(--color-border)] rounded-md text-sm font-semibold text-[var(--color-ink)]">
                {item.displayCode}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            className="flex-1 py-3 rounded-lg text-sm font-bold bg-[var(--color-border)] text-[var(--color-ink)]"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="flex-1 py-3 rounded-lg text-sm font-bold bg-[var(--color-navy)] text-white"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}