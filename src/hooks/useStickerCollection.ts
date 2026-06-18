import { useEffect, useRef, useState } from "react";
import { COLLECTION_STORAGE_KEY } from "../constants/collection";
import {
  fetchUserStickerCollection,
  syncUserStickerCollection,
} from "../services/stickerCollectionService";
import type { StickerCollection } from "../types/sticker";
import {
  applyStickerTradeToCollection,
  increaseCollectionQuantity,
  normalizeStickerCode,
  parseImportedStickerCodes,
} from "../utils/collection";

type SaveCollectionResult = "local" | "cloud";

export type ImportCollectionResult = {
  applied: boolean;
  ignoredCount: number;
  markedAll?: boolean;
  matchedCount: number;
  parsedCount: number;
};

type StoredCollection = {
  collection: StickerCollection;
  updatedAt: string | null;
};

type StoredCollectionPayload = {
  collection: StickerCollection;
  updatedAt?: string | null;
};

function getStoredCollection(): StoredCollection {
  const storedCollection = localStorage.getItem(COLLECTION_STORAGE_KEY);

  if (!storedCollection) {
    return {
      collection: {},
      updatedAt: null,
    };
  }

  try {
    const parsed = JSON.parse(storedCollection) as
      | StickerCollection
      | StoredCollectionPayload;

    if (isStoredCollectionPayload(parsed)) {
      return {
        collection: parsed.collection,
        updatedAt: parsed.updatedAt ?? null,
      };
    }

    return {
      collection: parsed as StickerCollection,
      updatedAt: null,
    };
  } catch {
    return {
      collection: {},
      updatedAt: null,
    };
  }
}

function isStoredCollectionPayload(
  value: StickerCollection | StoredCollectionPayload
): value is StoredCollectionPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    "collection" in value &&
    typeof value.collection === "object" &&
    value.collection !== null
  );
}

function setStoredCollection({
  collection,
  updatedAt,
}: StoredCollection): void {
  localStorage.setItem(
    COLLECTION_STORAGE_KEY,
    JSON.stringify({
      collection,
      updatedAt,
    })
  );
}

function isRemoteCollectionNewer(
  localUpdatedAt: string | null,
  remoteUpdatedAt: string | null
): boolean {
  const remoteTime = parseTimestamp(remoteUpdatedAt);

  if (remoteTime === null) {
    return false;
  }

  const localTime = parseTimestamp(localUpdatedAt);

  if (localTime === null) {
    return true;
  }

  return remoteTime >= localTime;
}

function parseTimestamp(timestamp: string | null): number | null {
  if (!timestamp) {
    return null;
  }

  const time = Date.parse(timestamp);

  return Number.isNaN(time) ? null : time;
}

export function useStickerCollection(userId?: string) {
  const [initialStoredCollection] =
    useState<StoredCollection>(getStoredCollection);
  const [collection, setCollection] = useState<StickerCollection>(
    initialStoredCollection.collection
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const localUpdatedAtRef = useRef<string | null>(
    initialStoredCollection.updatedAt
  );
  const nextStorageUpdatedAtRef = useRef<string | null | undefined>(undefined);
  const skipNextCloudSyncRef = useRef(false);
  const hasMountedRef = useRef(false);
  const syncedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const nextUpdatedAt =
      nextStorageUpdatedAtRef.current ?? new Date().toISOString();

    nextStorageUpdatedAtRef.current = undefined;
    localUpdatedAtRef.current = nextUpdatedAt;

    setStoredCollection({
      collection,
      updatedAt: nextUpdatedAt,
    });
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
        const shouldUseRemoteCollection = isRemoteCollectionNewer(
          localCollection.updatedAt,
          remoteCollection.updatedAt
        );

        if (!isMounted) {
          return;
        }

        if (shouldUseRemoteCollection) {
          nextStorageUpdatedAtRef.current = remoteCollection.updatedAt;
          skipNextCloudSyncRef.current = true;
          setCollection(remoteCollection.collection);
          syncedUserIdRef.current = userId;
          return;
        }

        nextStorageUpdatedAtRef.current = localCollection.updatedAt;
        skipNextCloudSyncRef.current = true;
        setCollection(localCollection.collection);
        const updatedAt = await syncUserStickerCollection(
          userId,
          localCollection.collection
        );

        localUpdatedAtRef.current = updatedAt;
        setStoredCollection({
          collection: localCollection.collection,
          updatedAt,
        });

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

    if (skipNextCloudSyncRef.current) {
      skipNextCloudSyncRef.current = false;
      return;
    }

    const timeout = window.setTimeout(async () => {
      if (!userId) return;

      try {
        setSyncError(null);
        const updatedAt = await syncUserStickerCollection(userId, collection);
        localUpdatedAtRef.current = updatedAt;
        setStoredCollection({
          collection,
          updatedAt,
        });
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
    setCollection((currentCollection) =>
      increaseCollectionQuantity(currentCollection, stickerId)
    );
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
    importText: string,
    stickerCodes: Map<number, string>
  ): ImportCollectionResult {
    const missingCodes = parseImportedStickerCodes(importText);

    if (missingCodes.length === 0) {
      if (importText.trim().length > 0) {
        return {
          applied: false,
          ignoredCount: 0,
          matchedCount: 0,
          parsedCount: 0,
        };
      }

      setCollection((current) => {
        const updated = { ...current };
        stickerCodes.forEach((_, id) => {
          if (!updated[id]) {
            updated[id] = 1;
          }
        });
        return updated;
      });

      return {
        applied: true,
        ignoredCount: 0,
        markedAll: true,
        matchedCount: stickerCodes.size,
        parsedCount: 0,
      };
    }

    const importMatch = getImportStickerMatch(missingCodes, stickerCodes);

    if (importMatch.matchedIds.size === 0) {
      return importMatch.result;
    }

    setCollection((current) => {
      const updated = { ...current };
      stickerCodes.forEach((_, id) => {
        if (!importMatch.matchedIds.has(id) && !updated[id]) {
          updated[id] = 1;
        }
      });
      return updated;
    });

    return importMatch.result;
  }

  function importRepeatedList(
    importText: string,
    stickerCodes: Map<number, string>
  ): ImportCollectionResult {
    const repeatedCodes = parseImportedStickerCodes(importText);

    if (repeatedCodes.length === 0) {
      return {
        applied: false,
        ignoredCount: 0,
        matchedCount: 0,
        parsedCount: 0,
      };
    }

    const importMatch = getImportStickerMatch(repeatedCodes, stickerCodes);

    if (importMatch.matchedIds.size === 0) {
      return importMatch.result;
    }

    setCollection((current) => {
      const updated = { ...current };
      importMatch.matchedIds.forEach((id) => {
        if ((updated[id] ?? 0) < 2) {
          updated[id] = 2;
        }
      });
      return updated;
    });

    return importMatch.result;
  }

  async function saveCollection(): Promise<SaveCollectionResult> {
    const updatedAt = new Date().toISOString();
    localUpdatedAtRef.current = updatedAt;
    setStoredCollection({
      collection,
      updatedAt,
    });

    if (!userId) {
      return "local";
    }

    try {
      setIsSyncing(true);
      setSyncError(null);

      const syncedAt = await syncUserStickerCollection(userId, collection);
      localUpdatedAtRef.current = syncedAt;
      setStoredCollection({
        collection,
        updatedAt: syncedAt,
      });

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

  function applyTrade(outgoingStickerIds: number[], incomingStickerIds: number[]) {
    setCollection((currentCollection) =>
      applyStickerTradeToCollection(
        currentCollection,
        outgoingStickerIds,
        incomingStickerIds
      )
    );
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
    importRepeatedList,
    applyTrade,
  };
}

function getImportStickerMatch(
  importedCodes: string[],
  stickerCodes: Map<number, string>
): { matchedIds: Set<number>; result: ImportCollectionResult } {
  const normalizedImportedCodes = new Set(
    importedCodes.map((code) => normalizeStickerCode(code))
  );
  const matchedIds = new Set<number>();

  stickerCodes.forEach((code, id) => {
    if (normalizedImportedCodes.has(normalizeStickerCode(code))) {
      matchedIds.add(id);
    }
  });

  return {
    matchedIds,
    result: {
      applied: matchedIds.size > 0,
      ignoredCount: Math.max(normalizedImportedCodes.size - matchedIds.size, 0),
      matchedCount: matchedIds.size,
      parsedCount: normalizedImportedCodes.size,
    },
  };
}
