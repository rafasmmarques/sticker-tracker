import type { TradeItem } from "../../types/sticker";
import "../../styles/trade-confirm-modal.css";

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
    <div className="trade-confirm-modal__overlay" onClick={onCancel}>
      <div className="trade-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="trade-confirm-modal__title">Confirmar troca</h3>

        <div className="trade-confirm-modal__section">
          <h4 className="trade-confirm-modal__subtitle">Você vai DAR:</h4>
          <div className="trade-confirm-modal__list">
            {giveItems.map((item) => (
              <span key={item.stickerId} className="trade-confirm-modal__item">
                {item.displayCode}
              </span>
            ))}
          </div>
        </div>

        <div className="trade-confirm-modal__section">
          <h4 className="trade-confirm-modal__subtitle">Você vai RECEBER:</h4>
          <div className="trade-confirm-modal__list">
            {receiveItems.map((item) => (
              <span key={item.stickerId} className="trade-confirm-modal__item">
                {item.displayCode}
              </span>
            ))}
          </div>
        </div>

        <div className="trade-confirm-modal__actions">
          <button
            type="button"
            className="trade-confirm-modal__btn trade-confirm-modal__btn--cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="trade-confirm-modal__btn trade-confirm-modal__btn--confirm"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}