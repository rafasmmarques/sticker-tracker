import { useEffect, type FormEvent } from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCamera,
  faKeyboard,
  faMinus,
  faPlus,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import { useCamera } from "../hooks/useCamera";
import { useStickerScanner, type ScannerMode } from "../hooks/useStickerScanner";
import type { Sticker, StickerCollection } from "../types/sticker";

type ScannerPageProps = {
  stickers: Sticker[];
  collection: StickerCollection;
  increaseStickerQuantity: (stickerId: number) => void;
  decreaseStickerQuantity: (stickerId: number) => void;
};

const modeOptions: Array<{
  value: ScannerMode;
  label: string;
  icon: typeof faPlus;
}> = [
  {
    value: "add",
    label: "Adicionar à coleção",
    icon: faPlus,
  },
  {
    value: "removeRepeated",
    label: "Dar baixa em repetida",
    icon: faMinus,
  },
];

export function ScannerPage({
  stickers,
  collection,
  increaseStickerQuantity,
  decreaseStickerQuantity,
}: ScannerPageProps) {
  const {
    videoRef,
    isCameraActive,
    isCameraLoading,
    cameraError,
    startCamera,
    stopCamera,
    captureFrame,
  } = useCamera();
  const {
    mode,
    setMode,
    manualCode,
    setManualCode,
    isAnalyzing,
    lastSticker,
    lastCode,
    analyzeImage,
    submitManualCode,
  } = useStickerScanner({
    stickers,
    collection,
    increaseStickerQuantity,
    decreaseStickerQuantity,
  });

  useEffect(() => {
    void startCamera();
  }, [startCamera]);

  function handleCapture(): void {
    void analyzeImage(captureFrame());
  }

  function handleManualSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    submitManualCode();
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-4 text-ink">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-xl flex-col gap-4">
        <header className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy shadow-lg"
            aria-label="Voltar para a coleção"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-xs font-black uppercase text-blue">
              Scanner de figurinhas
            </p>
            <h1 className="truncate text-xl font-black text-navy">
              Minha Coleção 2026
            </h1>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy shadow-lg disabled:opacity-50"
            onClick={isCameraActive ? stopCamera : () => void startCamera()}
            disabled={isCameraLoading}
            aria-label={isCameraActive ? "Desligar câmera" : "Abrir câmera"}
          >
            <FontAwesomeIcon icon={isCameraActive ? faStop : faCamera} />
          </button>
        </header>

        <section
          className="relative isolate overflow-hidden rounded-[28px] bg-ink shadow-2xl"
          aria-label="Prévia da câmera"
        >
          <div className="aspect-[3/4] w-full sm:aspect-[4/5]">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              playsInline
              muted
              autoPlay
            />

            {!isCameraActive && (
              <div className="absolute inset-0 grid place-items-center bg-navy p-6 text-center text-white">
                <div>
                  <FontAwesomeIcon icon={faCamera} className="mb-4 text-3xl" />
                  <p className="text-lg font-black">
                    {isCameraLoading ? "Abrindo câmera..." : "Câmera desligada"}
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    Use o botão da câmera para ler o código no verso.
                  </p>
                </div>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/12 px-6 pb-24 pt-10">
              <div className="relative mt-4 h-24 w-full max-w-sm rounded-2xl border-2 border-lime bg-ink/20 shadow-[0_0_0_999px_rgba(17,24,39,0.24),0_18px_44px_rgba(0,0,0,0.26)]">
                <div className="absolute inset-2 rounded-xl border border-dashed border-white/60" />
                <div className="absolute -top-4 right-4 rounded-lg bg-lime px-3 py-1 text-xs font-black uppercase text-ink shadow-lg">
                  BRA 10
                </div>

                {isAnalyzing && (
                  <div className="absolute inset-2 overflow-hidden rounded-xl bg-lime/10">
                    <div className="animate-scan-line absolute left-3 right-3 top-0 h-1 rounded-full bg-lime shadow-[0_0_18px_rgba(155,207,67,0.95),0_0_42px_rgba(155,207,67,0.55)]" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-16 text-white">
            <p className="text-sm font-bold">
              {isAnalyzing ? "Analisando..." : "Aproxime o código"}
            </p>
            <p className="mt-1 text-xs text-white/75">
              {lastSticker
                ? `Última leitura: ${lastSticker.displayCode}`
                : lastCode
                ? `Última tentativa: ${lastCode}`
                : "Preencha o guia com o código impresso no verso."}
            </p>
          </div>
        </section>

        {cameraError && (
          <p className="rounded-2xl bg-red px-4 py-3 text-sm font-bold text-white">
            {cameraError}
          </p>
        )}

        <section className="grid grid-cols-2 gap-2" aria-label="Modo do scanner">
          {modeOptions.map((option) => {
            const isSelected = mode === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={`flex min-h-16 items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-black transition ${
                  isSelected
                    ? "border-blue bg-blue text-white shadow-lg"
                    : "border-black/10 bg-white text-navy"
                }`}
                onClick={() => setMode(option.value)}
              >
                <FontAwesomeIcon icon={option.icon} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </section>

        <div className="sticky bottom-3 z-10 mt-auto grid gap-3 rounded-[28px] border border-black/10 bg-white/95 p-3 shadow-2xl backdrop-blur-md">
          <button
            type="button"
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-red px-5 py-4 text-base font-black text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleCapture}
            disabled={!isCameraActive || isAnalyzing}
          >
            <FontAwesomeIcon icon={faCamera} />
            <span>{isAnalyzing ? "Analisando..." : "Escanear figurinha"}</span>
          </button>

          <form className="flex gap-2" onSubmit={handleManualSubmit}>
            <label className="sr-only" htmlFor="manual-sticker-code">
              Código manual
            </label>
            <div className="flex min-h-12 flex-1 items-center gap-2 rounded-2xl border border-black/10 bg-cream px-3 text-ink">
              <FontAwesomeIcon icon={faKeyboard} className="text-muted" />
              <input
                id="manual-sticker-code"
                className="w-full bg-transparent text-base font-bold uppercase outline-none placeholder:normal-case placeholder:text-muted"
                value={manualCode}
                onChange={(event) => setManualCode(event.target.value)}
                placeholder="COL 18"
                autoCapitalize="characters"
                inputMode="text"
              />
            </div>
            <button
              type="submit"
              className="min-h-12 rounded-2xl bg-navy px-4 text-sm font-black text-white"
            >
              Aplicar
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
