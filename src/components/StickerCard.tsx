import type { Sticker } from "../types/sticker";
import { BrandMark } from "./BrandMark";

type StickerCardProps = {
  sticker: Sticker;
  quantity: number;
  onIncreaseQuantity: (stickerId: number) => void;
  onDecreaseQuantity: (stickerId: number) => void;
};

const CARD_THEMES = ["usa", "mexico", "canada", "classic"] as const;

export function StickerCard({
  sticker,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: StickerCardProps) {
  const repeatedQuantity = Math.max(quantity - 1, 0);
  const theme = CARD_THEMES[sticker.id % CARD_THEMES.length];

  return (
    <article className="sticker-item">
      <div
        className={[
          "sticker-card",
          `sticker-card--${theme}`,
          quantity > 0 ? "sticker-card--owned" : "",
        ].join(" ")}
      >
        <span className="sticker-card__number">{sticker.code}</span>

        <div className="sticker-card__art">
          <BrandMark />
        </div>

        <div className="sticker-card__footer">
          <strong>{getStickerStatus(quantity)}</strong>

          {repeatedQuantity > 0 && (
            <span>
              {repeatedQuantity} repetida{repeatedQuantity > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <div className="sticker-card__actions">
        <button
          className="quantity-button quantity-button--remove"
          type="button"
          aria-label={`Remover figurinha ${sticker.code}`}
          disabled={quantity === 0}
          onClick={() => onDecreaseQuantity(sticker.id)}
        >
          −
        </button>

        <div
          className="quantity-indicator"
          aria-label={`Quantidade da figurinha ${sticker.code}`}
        >
          {quantity}
        </div>

        <button
          className="quantity-button quantity-button--add"
          type="button"
          aria-label={`Adicionar figurinha ${sticker.code}`}
          onClick={() => onIncreaseQuantity(sticker.id)}
        >
          +
        </button>
      </div>
    </article>
  );
}

function getStickerStatus(quantity: number): string {
  if (quantity === 0) {
    return "Falta";
  }

  if (quantity === 1) {
    return "Tenho";
  }

  return `${quantity}x`;
}
