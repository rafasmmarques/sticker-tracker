import { useEffect, useRef, useState } from "react";
import { COLLECTION_STORAGE_KEY } from "../constants/collection";
import {
  fetchUserStickerCollection,
  syncUserStickerCollection,
} from "../services/stickerCollectionService";
import type { StickerCollection } from "../types/sticker";

type SaveCollectionResult = "local" | "cloud";

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

function mergeCollections(
  localCollection: StickerCollection,
  remoteCollection: StickerCollection
): StickerCollection {
  const stickerIds = new Set([
    ...Object.keys(localCollection),
    ...Object.keys(remoteCollection),
  ]);

  return Array.from(stickerIds).reduce<StickerCollection>(
    (collection, stickerId) => {
      const id = Number(stickerId);
      const quantity = Math.max(
        localCollection[id] ?? 0,
        remoteCollection[id] ?? 0
      );

      if (quantity > 0) {
        collection[id] = quantity;
      }

      return collection;
    },
    {}
  );
}

export function useStickerCollection(userId?: string) {
  const [collection, setCollection] =
    useState<StickerCollection>(getStoredCollection);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const syncedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(collection));
  }, [collection]);

  useEffect(() => {
    if (!userId) {
      syncedUserIdRef.current = null;

      return;
    }

    let isMounted = true;

    async function hydrateCollection() {
      if (!userId) return;

      try {
        setIsSyncing(true);
        setSyncError(null);

        const localCollection = getStoredCollection();
        const remoteCollection = await fetchUserStickerCollection(userId);
        const mergedCollection = mergeCollections(
          localCollection,
          remoteCollection
        );

        if (!isMounted) {
          return;
        }

        setCollection(mergedCollection);
        await syncUserStickerCollection(userId, mergedCollection);

        syncedUserIdRef.current = userId;
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setSyncError(
            "Alteração salva neste navegador, mas ainda não sincronizada na nuvem."
          );
        }
      } finally {
        if (isMounted) {
          setIsSyncing(false);
        }
      }
    }

    hydrateCollection();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || syncedUserIdRef.current !== userId) {
      return;
    }

    const timeout = window.setTimeout(async () => {
      if (!userId) return;

      try {
        setSyncError(null);
        await syncUserStickerCollection(userId, collection);
      } catch (error) {
        console.error(error);
        setSyncError(
          "Alteração salva neste navegador, mas ainda não sincronizada na nuvem."
        );
      }
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [collection, userId]);

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

  function markAllStickers(stickerIds: number[]) {
    setCollection((currentCollection) => {
      const updated = { ...currentCollection };
      stickerIds.forEach((id) => {
        if (!updated[id]) {
          updated[id] = 1;
        }
      });
      return updated;
    });
  }

  function clearCollection() {
    setCollection({});
  }

  function importMissingList(
    missingCodes: string[],
    stickerCodes: Map<number, string>
  ) {
    if (missingCodes.length === 0) {
      setCollection((current) => {
        const updated = { ...current };
        stickerCodes.forEach((_, id) => {
          if (!updated[id]) {
            updated[id] = 1;
          }
        });
        return updated;
      });
      return;
    }

    const normalizedMissing = new Set(
      missingCodes.map((c) => c.toUpperCase().replace(/[- ]/g, ""))
    );

    setCollection((current) => {
      const updated = { ...current };
      stickerCodes.forEach((code, id) => {
        const normalizedCode = code.toUpperCase().replace(/[- ]/g, "");
        if (!normalizedMissing.has(normalizedCode) && !updated[id]) {
          updated[id] = 1;
        }
      });
      return updated;
    });
  }

  async function saveCollection(): Promise<SaveCollectionResult> {
    localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(collection));

    if (!userId) {
      return "local";
    }

    try {
      setIsSyncing(true);
      setSyncError(null);

      await syncUserStickerCollection(userId, collection);

      syncedUserIdRef.current = userId;

      return "cloud";
    } catch (error) {
      console.error(error);

      setSyncError(
        "Alteração salva neste navegador, mas ainda não sincronizada na nuvem."
      );

      throw error;
    } finally {
      setIsSyncing(false);
    }
  }

  return {
    collection,
    isSyncing,
    syncError,
    saveCollection,
    increaseStickerQuantity,
    decreaseStickerQuantity,
    markAllStickers,
    clearCollection,
    importMissingList,
  };
}
