import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { COLLECTION_CELEBRATION_STORAGE_KEY } from "../constants/collection";
import type { Sticker, StickerCollection } from "../types/sticker";
import {
  getCollectionCompletionChange,
  getCompletedSelections,
  isAlbumComplete,
} from "../utils/collection";
import { showToast } from "../utils/toast";

type CelebrationHistory = {
  completedSelectionKeys: string[];
  albumCompleted: boolean;
};

const emptyHistory: CelebrationHistory = {
  completedSelectionKeys: [],
  albumCompleted: false,
};

export function useCollectionCelebration(
  stickers: Sticker[],
  collection: StickerCollection,
) {
  const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false);
  const historyRef = useRef<CelebrationHistory>(loadCelebrationHistory());

  const updateCelebrationHistory = useCallback(
    (update: { selectionKeys?: string[]; albumCompleted?: boolean }) => {
      const completedSelectionKeys = new Set(
        historyRef.current.completedSelectionKeys,
      );

      update.selectionKeys?.forEach((key) => completedSelectionKeys.add(key));

      const nextHistory = {
        completedSelectionKeys: Array.from(completedSelectionKeys),
        albumCompleted:
          historyRef.current.albumCompleted || update.albumCompleted === true,
      };

      historyRef.current = nextHistory;
      saveCelebrationHistory(nextHistory);
    },
    [],
  );

  useEffect(() => {
    const currentCompletedSelections = getCompletedSelections(
      stickers,
      collection,
    );
    const hasCompletedAlbum = isAlbumComplete(stickers, collection);

    if (currentCompletedSelections.length === 0 && !hasCompletedAlbum) {
      return;
    }

    updateCelebrationHistory({
      selectionKeys: currentCompletedSelections.map(
        (selection) => selection.key,
      ),
      albumCompleted: hasCompletedAlbum,
    });
  }, [collection, stickers, updateCelebrationHistory]);

  function celebrateCollectionChange(
    previousCollection: StickerCollection,
    nextCollection: StickerCollection,
  ) {
    if (stickers.length === 0) {
      return;
    }

    const completionChange = getCollectionCompletionChange(
      stickers,
      previousCollection,
      nextCollection,
    );

    const completedSelections = completionChange.completedSelections.filter(
      (selection) =>
        !historyRef.current.completedSelectionKeys.includes(selection.key),
    );
    const shouldCelebrateAlbum =
      completionChange.albumCompleted && !historyRef.current.albumCompleted;

    if (completedSelections.length === 0 && !shouldCelebrateAlbum) {
      return;
    }

    updateCelebrationHistory({
      selectionKeys: completedSelections.map((selection) => selection.key),
      albumCompleted: shouldCelebrateAlbum,
    });

    if (shouldCelebrateAlbum) {
      fireAlbumConfetti();
      setIsAlbumDialogOpen(true);
      return;
    }

    fireSelectionConfetti();
    showToast({
      title: "Seleção completa!",
      description: formatCompletedSelections(completedSelections),
      variant: "success",
    });
  }

  function closeAlbumDialog() {
    setIsAlbumDialogOpen(false);
  }

  return {
    isAlbumDialogOpen,
    closeAlbumDialog,
    celebrateCollectionChange,
  };
}

function formatCompletedSelections(selections: { name: string }[]): string {
  if (selections.length === 1) {
    return `Você completou ${selections[0].name}.`;
  }

  const teamNames = selections.map((selection) => selection.name).join(", ");

  return `Você completou ${teamNames}.`;
}

function shouldReduceMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function fireSelectionConfetti() {
  if (shouldReduceMotion()) {
    return;
  }

  const zIndex = 1200;

  confetti({
    particleCount: 72,
    spread: 58,
    origin: { x: 0.12, y: 0.72 },
    angle: 55,
    ticks: 180,
    zIndex,
  });
  confetti({
    particleCount: 72,
    spread: 58,
    origin: { x: 0.88, y: 0.72 },
    angle: 125,
    ticks: 180,
    zIndex,
  });
}

function fireAlbumConfetti() {
  if (shouldReduceMotion()) {
    return;
  }

  const end = Date.now() + 2400;
  const colors = ["#171b5f", "#d8242f", "#177345", "#f36b21", "#9bcf43"];
  const zIndex = 1200;

  const frame = () => {
    confetti({
      particleCount: 12,
      angle: 60,
      spread: 82,
      origin: { x: 0, y: 0.72 },
      ticks: 220,
      colors,
      zIndex,
    });
    confetti({
      particleCount: 12,
      angle: 120,
      spread: 82,
      origin: { x: 1, y: 0.72 },
      ticks: 220,
      colors,
      zIndex,
    });

    if (Date.now() < end) {
      window.requestAnimationFrame(frame);
    }
  };

  frame();
}

function loadCelebrationHistory(): CelebrationHistory {
  const storedHistory = localStorage.getItem(
    COLLECTION_CELEBRATION_STORAGE_KEY,
  );

  if (!storedHistory) {
    return emptyHistory;
  }

  try {
    const parsed = JSON.parse(storedHistory) as Partial<CelebrationHistory>;

    return {
      completedSelectionKeys: Array.isArray(parsed.completedSelectionKeys)
        ? parsed.completedSelectionKeys.filter(
            (key): key is string => typeof key === "string",
          )
        : [],
      albumCompleted: parsed.albumCompleted === true,
    };
  } catch {
    return emptyHistory;
  }
}

function saveCelebrationHistory(history: CelebrationHistory) {
  localStorage.setItem(
    COLLECTION_CELEBRATION_STORAGE_KEY,
    JSON.stringify(history),
  );
}
