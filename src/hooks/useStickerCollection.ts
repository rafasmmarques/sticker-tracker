import { useEffect, useState } from "react";
import { COLLECTION_STORAGE_KEY } from "../constants/collection";
import type { StickerCollection } from "../types/sticker";

function getStoredCollection(): StickerCollection {
  const storedCollection = localStorage.getItem(COLLECTION_STORAGE_KEY);

  if (!storedCollection) {
    return {};
  }

  try {
    return JSON.parse(storedCollection) as StickerCollection;
  } catch {
    return {};
  }
}

export function useStickerCollection() {
  const [collection, setCollection] =
    useState<StickerCollection>(getStoredCollection);

  useEffect(() => {
    localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(collection));
  }, [collection]);

  function increaseStickerQuantity(stickerId: number) {
    setCollection((currentCollection) => ({
      ...currentCollection,
      [stickerId]: (currentCollection[stickerId] ?? 0) + 1,
    }));
  }

  function decreaseStickerQuantity(stickerId: number) {
    setCollection((currentCollection) => {
      const currentQuantity = currentCollection[stickerId] ?? 0;

      if (currentQuantity <= 1) {
        const updatedCollection = { ...currentCollection };

        delete updatedCollection[stickerId];

        return updatedCollection;
      }

      return {
        ...currentCollection,
        [stickerId]: currentQuantity - 1,
      };
    });
  }

  function clearCollection() {
    const shouldClear = window.confirm(
      "Tem certeza que deseja limpar toda a coleção?"
    );

    if (!shouldClear) {
      return;
    }

    setCollection({});
  }

  return {
    collection,
    increaseStickerQuantity,
    decreaseStickerQuantity,
    clearCollection,
  };
}
