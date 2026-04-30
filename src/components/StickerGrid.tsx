import type { Sticker, StickerCollection } from "../types/sticker";
import { getStickerQuantity } from "../utils/collection";
import { StickerCard } from "./StickerCard";

type StickerGridProps = {
  stickers: Sticker[];
  collection: StickerCollection;
  onIncreaseQuantity: (stickerId: number) => void;
  onDecreaseQuantity: (stickerId: number) => void;
};

export function StickerGrid({
  stickers,
  collection,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: StickerGridProps) {
  return (
    <section
      id="collection-grid"
      className="stickers-grid"
      aria-label="Lista de figurinhas"
    >
      {stickers.map((sticker) => (
        <StickerCard
          key={sticker.id}
          sticker={sticker}
          quantity={getStickerQuantity(collection, sticker.id)}
          onIncreaseQuantity={onIncreaseQuantity}
          onDecreaseQuantity={onDecreaseQuantity}
        />
      ))}
    </section>
  );
}
