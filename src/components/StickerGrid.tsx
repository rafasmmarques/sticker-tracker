import type { Sticker, StickerCollection } from "../types/sticker";
import { getStickerQuantity } from "../utils/collection";
import { StickerCard } from "./StickerCard";

type StickerGridProps = {
  stickers: Sticker[];
  collection: StickerCollection;
  onIncreaseQuantity: (stickerId: number) => void;
  onDecreaseQuantity: (stickerId: number) => void;
  showOnlyMissing?: boolean;
  showOnlyRepeated?: boolean;
};

export function StickerGrid({
  stickers,
  collection,
  onIncreaseQuantity,
  onDecreaseQuantity,
  showOnlyMissing = false,
  showOnlyRepeated = false,
}: StickerGridProps) {
  return (
    <section
      id="collection-grid"
      className="stickers-grid"
      aria-label="Lista de figurinhas"
    >
      {stickers.map((sticker) => {
        const quantity = getStickerQuantity(collection, sticker.id);

        return (
          <StickerCard
            key={sticker.id}
            sticker={sticker}
            quantity={quantity}
            showRepeatedQuantity={showOnlyRepeated}
            onIncreaseQuantity={onIncreaseQuantity}
            onDecreaseQuantity={onDecreaseQuantity}
            isHidden={
              (showOnlyMissing && quantity > 0) ||
              (showOnlyRepeated && quantity < 2)
            }
          />
        );
      })}
    </section>
  );
}
