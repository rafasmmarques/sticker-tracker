import type { Sticker, StickerCollection } from "../types/sticker";
import { getStickerQuantity } from "../utils/collection";
import { StickerCard } from "./StickerCard";

type StickerGridProps = {
  stickers: Sticker[];
  collection: StickerCollection;
  onIncreaseQuantity: (stickerId: number) => void;
  onDecreaseQuantity: (stickerId: number) => void;
  showOnlyMissing?: boolean;
};

export function StickerGrid({
  stickers,
  collection,
  onIncreaseQuantity,
  onDecreaseQuantity,
  showOnlyMissing = false,
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
          isHidden={showOnlyMissing && getStickerQuantity(collection, sticker.id) > 0}
        />
      ))}
    </section>
  );
}
