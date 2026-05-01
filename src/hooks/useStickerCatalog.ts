import { useEffect, useState } from "react";
import { stickers as fallbackStickers } from "../data/stickers";
import { fetchStickerCatalog } from "../services/stickerCatalogService";
import type { Sticker } from "../types/sticker";

export function useStickerCatalog() {
  const [stickers, setStickers] = useState<Sticker[]>(fallbackStickers);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStickerCatalog() {
      try {
        setIsLoading(true);
        setError(null);

        const catalog = await fetchStickerCatalog();

        if (!isMounted) {
          return;
        }

        setStickers(catalog.length > 0 ? catalog : fallbackStickers);
      } catch {
        if (isMounted) {
          setStickers(fallbackStickers);
          setError("Não foi possível carregar o catálogo online.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStickerCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    stickers,
    isLoading,
    error,
  };
}
