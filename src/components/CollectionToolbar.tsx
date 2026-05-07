import { useState } from "react";

export type GroupOption = {
  letter: string;
  teams: { fifaCode: string; name: string }[];
};

type ShowToast = (toast: {
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
}) => void;

type CollectionToolbarProps = {
  onMarkAllStickers?: () => void;
  allStickersCount?: number;
  onImportMissingList?: (missingCodes: string[]) => void;
  onImportRepeatedList?: (repeatedCodes: string[]) => void;
  showImportDialog?: boolean;
  onCloseImportDialog?: () => void;
  showMarkAllDialog?: boolean;
  onShowMarkAllDialogChange?: (show: boolean) => void;
  showToast?: ShowToast;
};

export function CollectionToolbar({
  onMarkAllStickers,
  allStickersCount = 0,
  onImportMissingList,
  onImportRepeatedList,
  showImportDialog = false,
  onCloseImportDialog,
  showMarkAllDialog = false,
  onShowMarkAllDialogChange,
  showToast,
}: CollectionToolbarProps) {
  const [importText, setImportText] = useState("");
  const [importMode, setImportMode] = useState<"missing" | "repeated">("missing");

  const handleConfirmMarkAll = () => {
    onMarkAllStickers?.();
    onShowMarkAllDialogChange?.(false);
    showToast?.({
      title: "Coleção marcada",
      description: `Todas as ${allStickersCount} figurinhas foram marcadas como tenho.`,
      variant: "success",
    });
  };

  const handleCancelDialog = () => {
    onShowMarkAllDialogChange?.(false);
  };

  const handleImportSubmit = () => {
    const codes = importText.split(",").map((s) => s.trim()).filter(Boolean);
    if (importMode === "missing") {
      onImportMissingList?.(codes);
    } else {
      onImportRepeatedList?.(codes);
    }
    onCloseImportDialog?.();
    setImportText("");
    showToast?.({
      title: "Figurinhas importadas.",
      description: `${codes.length} código(s) adicionado(s).`,
      variant: "success",
    });
  };

  const handleCancelImport = () => {
    onCloseImportDialog?.();
    setImportText("");
  };

  return (
    <section className="flex flex-col sm:flex-row items-end sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6 py-2" aria-label="Toolbar da coleção">
      <div className="collection-toolbar__header">
        <span className="section-kicker">Minha coleção</span>
        <h2>Marque suas figurinhas</h2>
      </div>

      {showMarkAllDialog && (
        <div className="fixed inset-0 bg-[#141d3d]/60 flex items-center justify-center z-50 p-4" onClick={handleCancelDialog}>
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-[400px] w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-ink)] mb-3">Marcar todas as figurinhas?</h3>
            <p className="text-sm sm:text-base text-[var(--color-ink)] mb-5">
              Tem certeza que deseja marcar todas as figurinhas? Isso vai
              marcar <strong>{allStickersCount}</strong> figurinhas como tenho.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <button
                type="button"
                className="flex-1 min-w-[100px] min-h-[44px] rounded-lg text-sm font-bold bg-gray-500 text-white border-none cursor-pointer hover:opacity-90"
                onClick={handleCancelDialog}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="flex-1 min-w-[100px] min-h-[44px] rounded-lg text-sm font-bold bg-green-700 text-white border-none cursor-pointer hover:opacity-90"
                onClick={handleConfirmMarkAll}
              >
                Marcar Todas
              </button>
            </div>
          </div>
        </div>
      )}

      {showImportDialog && (
        <div className="fixed inset-0 bg-[#141d3d]/60 flex items-center justify-center z-50 p-4" onClick={handleCancelImport}>
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-[400px] w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-ink)] mb-3">Importar figurinhas</h3>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                className={`flex-1 h-10 rounded-full text-sm font-bold transition ${
                  importMode === "missing"
                    ? "bg-[var(--color-navy)] text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
                onClick={() => setImportMode("missing")}
              >
                Faltantes
              </button>
              <button
                type="button"
                className={`flex-1 h-10 rounded-full text-sm font-bold transition ${
                  importMode === "repeated"
                    ? "bg-[var(--color-navy)] text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
                onClick={() => setImportMode("repeated")}
              >
                Repetidas
              </button>
            </div>
            <p className="text-sm text-[var(--color-ink)] mb-3">
              {importMode === "missing"
                ? `Cole aqui a lista de códigos das figurinhas que faltam, separadas por vírgula. (Se vazio, marca todas como tenho)`
                : `Cole aqui a lista de códigos das figurinhas repetidas, separadas por vírgula. (Isso aumenta +1 em cada figurinha)`}
            </p>
            <textarea
              className="w-full min-h-[100px] p-3 border border-[var(--color-border)] rounded-xl resize-y text-sm font-normal"
              placeholder={importMode === "missing" ? "Ex: GER 5, BRA 10, ARG 3" : "Ex: GER 5, BRA 10, ARG 3"}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={4}
            />
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                type="button"
                className="flex-1 min-w-[100px] min-h-[44px] rounded-lg text-sm font-bold bg-gray-500 text-white border-none cursor-pointer hover:opacity-90"
                onClick={handleCancelImport}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="flex-1 min-w-[100px] min-h-[44px] rounded-lg text-sm font-bold bg-green-700 text-white border-none cursor-pointer hover:opacity-90"
                onClick={handleImportSubmit}
              >
                Importar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}