import { useMemo, useRef, useState } from "react";
import { analyzeStickerImage } from "../services/geminiService";
import type { Sticker, StickerCollection } from "../types/sticker";
import { showToast } from "../utils/toast";

export type ScannerMode = "add" | "removeRepeated";

type UseStickerScannerInput = {
  stickers: Sticker[];
  collection: StickerCollection;
  increaseStickerQuantity: (stickerId: number) => void;
  decreaseStickerQuantity: (stickerId: number) => void;
};

type UseStickerScannerResult = {
  mode: ScannerMode;
  setMode: (mode: ScannerMode) => void;
  manualCode: string;
  setManualCode: (code: string) => void;
  isAnalyzing: boolean;
  lastSticker: Sticker | null;
  lastCode: string | null;
  analyzeImage: (image: string | null) => Promise<void>;
  submitManualCode: () => void;
};

type LastScan = {
  code: string;
  scannedAt: number;
};

const SCAN_COOLDOWN_MS = 4500;

export function useStickerScanner({
  stickers,
  collection,
  increaseStickerQuantity,
  decreaseStickerQuantity,
}: UseStickerScannerInput): UseStickerScannerResult {
  const [mode, setMode] = useState<ScannerMode>("add");
  const [manualCode, setManualCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastSticker, setLastSticker] = useState<Sticker | null>(null);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const lastScanRef = useRef<LastScan | null>(null);

  const stickerByCode = useMemo(() => {
    return stickers.reduce<Map<string, Sticker>>((map, sticker) => {
      const keys = [
        sticker.displayCode,
        sticker.code,
        `${sticker.groupCode} ${sticker.numberInGroup}`,
        `${sticker.groupCode}${sticker.numberInGroup}`,
      ];

      keys.forEach((key) => {
        map.set(normalizeStickerCode(key), sticker);
      });

      return map;
    }, new Map());
  }, [stickers]);

  async function analyzeImage(image: string | null): Promise<void> {
    if (!image) {
      showToast({
        title: "Não foi possível capturar a imagem.",
        description: "Aponte a câmera para a figurinha e tente novamente.",
        variant: "error",
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      const result = await analyzeStickerImage(image);

      if (!result.success || !result.stickerCode) {
        const isApiFailure = Boolean(result.error);

        showToast({
          title: isApiFailure
            ? "Não foi possível analisar agora."
            : "Não foi possível ler a figurinha.",
          description: isApiFailure
            ? "Aguarde um instante e tente novamente."
            : "Tente aproximar a câmera do código no verso.",
          variant: "error",
        });
        return;
      }

      applyStickerCode(result.stickerCode);
    } catch (error) {
      showToast({
        title: "Erro ao analisar a figurinha.",
        description:
          error instanceof Error ? error.message : "Tente novamente em instantes.",
        variant: "error",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  function submitManualCode(): void {
    applyStickerCode(manualCode);
  }

  function applyStickerCode(rawCode: string): void {
    const normalizedCode = normalizeStickerCode(rawCode);

    if (!normalizedCode) {
      showToast({
        title: "Informe um código de figurinha.",
        description: "Use o formato COL 18, BRA 7 ou FWC 3.",
        variant: "error",
      });
      return;
    }

    const sticker = stickerByCode.get(normalizedCode);

    if (!sticker) {
      setLastSticker(null);
      setLastCode(formatStickerCode(normalizedCode));
      showToast({
        title: "Figurinha não encontrada no catálogo.",
        description: "Confira se o código lido pertence a este álbum.",
        variant: "error",
      });
      return;
    }

    if (isRepeatedScan(normalizedCode)) {
      showToast({
        title: "Figurinha já lida há pouco.",
        description: "Aguarde um instante antes de escanear o mesmo código.",
        variant: "info",
      });
      return;
    }

    if (mode === "removeRepeated") {
      const currentQuantity = collection[sticker.id] ?? 0;

      if (currentQuantity <= 1) {
        setLastSticker(sticker);
        setLastCode(sticker.displayCode);
        showToast({
          title: "Sem repetida para baixar.",
          description: "Essa figurinha precisa ter pelo menos 2 unidades.",
          variant: "error",
        });
        return;
      }

      decreaseStickerQuantity(sticker.id);
      markLastScan(normalizedCode, sticker);
      showToast({
        title: "Repetida baixada.",
        description: `${sticker.displayCode} foi removida das repetidas.`,
        variant: "success",
      });
      return;
    }

    increaseStickerQuantity(sticker.id);
    markLastScan(normalizedCode, sticker);
    showToast({
      title: "Figurinha adicionada.",
      description: `${sticker.displayCode} entrou na sua coleção.`,
      variant: "success",
    });
  }

  function isRepeatedScan(code: string): boolean {
    const lastScan = lastScanRef.current;

    if (!lastScan || lastScan.code !== code) {
      return false;
    }

    return Date.now() - lastScan.scannedAt < SCAN_COOLDOWN_MS;
  }

  function markLastScan(code: string, sticker: Sticker): void {
    lastScanRef.current = {
      code,
      scannedAt: Date.now(),
    };
    setLastSticker(sticker);
    setLastCode(sticker.displayCode);
    setManualCode("");
  }

  return {
    mode,
    setMode,
    manualCode,
    setManualCode,
    isAnalyzing,
    lastSticker,
    lastCode,
    analyzeImage,
    submitManualCode,
  };
}

function normalizeStickerCode(code: string): string {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function formatStickerCode(normalizedCode: string): string {
  const match = normalizedCode.match(/^([A-Z]{2,4})(\d{1,2})$/);

  if (!match) {
    return normalizedCode;
  }

  return `${match[1]} ${Number(match[2])}`;
}
