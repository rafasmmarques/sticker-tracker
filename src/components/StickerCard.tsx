import { useState, useEffect } from "react";
import type { Sticker } from "../types/sticker";
import { FIFA_TO_ISO } from "../utils/countryCodes";

type StickerCardProps = {
  sticker: Sticker;
  quantity: number;
  showRepeatedQuantity?: boolean;
  onIncreaseQuantity: (stickerId: number) => void;
  onDecreaseQuantity: (stickerId: number) => void;
  isHidden?: boolean;
};

export function StickerCard({
  sticker,
  quantity,
  showRepeatedQuantity = false,
  onIncreaseQuantity,
  onDecreaseQuantity,
  isHidden = false,
}: StickerCardProps) {
  const [showSticker, setShowSticker] = useState(true);

  useEffect(() => {
    if (isHidden && showSticker) {
      const timer = setTimeout(() => {
        setShowSticker(false);
      }, 400);
      return () => clearTimeout(timer);
    }

    if (!isHidden && !showSticker) {
      const timer = setTimeout(() => {
        setShowSticker(true);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isHidden, showSticker]);

  if (!showSticker) return null;

  const repeatedQuantity = Math.max(quantity - 1, 0);
  const displayQuantity = showRepeatedQuantity ? repeatedQuantity : quantity;
  const team = sticker.team;

  const fifaCode = team?.fifaCode?.toUpperCase() ?? null;
  const isoCode = fifaCode ? FIFA_TO_ISO[fifaCode]?.toLowerCase() : null;
  const flagCode = isoCode ?? team?.countryCode?.toLowerCase() ?? null;
  const primaryColor = team?.primaryColor ?? null;
  const secondaryColor = team?.secondaryColor ?? null;

  const isIntroSticker =
    sticker.groupCode === "FWC" || sticker.groupCode === "PAN";
  const isCocaColaSticker = sticker.groupCode === "CC";
  const monogram = getStickerMonogram(sticker.groupCode);
  
  const cardStyle = isIntroSticker
    ? {
        background: "linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 50%, #d0d0d0 100%)",
        borderColor: "rgba(180, 180, 180, 0.4)",
      } as React.CSSProperties
    : isCocaColaSticker
      ? {
          "--team-primary": "#e41f26",
          "--team-secondary": "#050505",
          background:
            "linear-gradient(135deg, #e41f26 0%, #8d1117 46%, #050505 100%)",
          borderColor: "rgba(5, 5, 5, 0.42)",
        } as React.CSSProperties
      : primaryColor || secondaryColor
        ? {
            "--team-primary": primaryColor,
            "--team-secondary": secondaryColor,
          } as React.CSSProperties
        : undefined;

  return (
    <article className="flex flex-col gap-2.5">
      <div
        className={[
          "sticker-card",
          quantity > 0 ? "sticker-card--owned" : "",
          isHidden ? "sticker-card--hidden" : "",
        ].join(" ")}
        style={cardStyle}
      >
        <span className="sticker-card__number">{sticker.displayCode}</span>

<div className="sticker-card__art">
          {flagCode ? (
            <img
              src={`https://flagcdn.com/w160/${flagCode}.png`}
              alt={team?.name ?? ""}
              className="sticker-card__flag"
              loading="lazy"
            />
          ) : monogram ? (
            <span
              className={[
                "sticker-card__monogram",
                isCocaColaSticker ? "sticker-card__monogram--light" : "",
              ].join(" ")}
              aria-hidden="true"
            >
              {monogram}
            </span>
          ) : null}
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

      <div className="flex items-center justify-center gap-2">
        <button
          className="inline-flex w-9 h-9 border rounded-full bg-white/60 text-lg font-bold leading-none text-red-600/80 hover:bg-red-500 hover:text-white transition disabled:opacity-30 disabled:transform-none md:w-[42px] md:h-[42px]"
          type="button"
          aria-label={`Remover figurinha ${sticker.displayCode}`}
          disabled={quantity === 0}
          onClick={() => onDecreaseQuantity(sticker.id)}
        >
          <span className="flex items-center justify-center w-full h-full">−</span>
        </button>

        <div
          className="inline-flex min-w-9 h-7 items-center justify-center border rounded-full px-2.5 text-sm font-bold text-[var(--color-navy)] bg-white/70"
          aria-label={`Quantidade da figurinha ${sticker.displayCode}`}
        >
          {displayQuantity}
        </div>

        <button
          className="inline-flex w-9 h-9 border rounded-full bg-white/60 text-lg font-bold leading-none text-green-600/80 hover:bg-green-500 hover:text-white transition md:w-[42px] md:h-[42px]"
          type="button"
          aria-label={`Adicionar figurinha ${sticker.displayCode}`}
          onClick={() => onIncreaseQuantity(sticker.id)}
        >
          <span className="flex items-center justify-center w-full h-full">+</span>
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

function getStickerMonogram(groupCode: string): string | null {
  if (groupCode === "PAN") {
    return "00";
  }

  if (groupCode === "FWC") {
    return "FWC";
  }

  if (groupCode === "CC") {
    return "CC";
  }

  return null;
}
