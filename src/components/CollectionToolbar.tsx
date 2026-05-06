import { useState } from "react";

export type GroupOption = {
  letter: string;
  teams: { fifaCode: string; name: string }[];
};

type CollectionToolbarProps = {
  onMarkAllStickers?: () => void;
  onClearCollection?: () => void;
  allStickersCount?: number;
  onImportList?: (missingCodes: string[]) => void;
  showImportDialog?: boolean;
  onCloseImportDialog?: () => void;
};

export function CollectionToolbar({
  onMarkAllStickers,
  onClearCollection,
  allStickersCount = 0,
  onImportList,
  showImportDialog = false,
  onCloseImportDialog,
}: CollectionToolbarProps) {
  const [showMarkAllDialog, setShowMarkAllDialog] = useState(false);
  const [importText, setImportText] = useState("");

  const handleConfirmMarkAll = () => {
    onMarkAllStickers?.();
    setShowMarkAllDialog(false);
  };

  const handleClearCollection = () => {
    onClearCollection?.();
    setShowMarkAllDialog(false);
  };

  const handleCancelDialog = () => {
    setShowMarkAllDialog(false);
  };

  const handleImportSubmit = () => {
    onImportList?.(importText.split(",").map((s) => s.trim()).filter(Boolean));
    onCloseImportDialog?.();
    setImportText("");
  };

  const handleCancelImport = () => {
    onCloseImportDialog?.();
    setImportText("");
  };

  return (
    <section className="collection-toolbar" aria-label="Toolbar da coleção">
      <div className="collection-toolbar__header">
        <span className="section-kicker">Minha coleção</span>
        <h2>Marque suas figurinhas</h2>
      </div>

      {showMarkAllDialog && (
        <div className="dialog-overlay" onClick={handleCancelDialog}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <h3>Marcar todas as figurinhas?</h3>
            <p>
              Tem certeza que deseja marcar todas as figurinhas? Isso vai
              marcar <strong>{allStickersCount}</strong> figurinhas como tenho.
            </p>
            <div className="dialog-actions">
              <button
                type="button"
                className="btn-cancelar"
                onClick={handleCancelDialog}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-zerar"
                onClick={handleClearCollection}
              >
                Zerar Tudo
              </button>
              <button
                type="button"
                className="btn-confirmar"
                onClick={handleConfirmMarkAll}
              >
                Marcar Todas
              </button>
            </div>
          </div>
        </div>
      )}

      {showImportDialog && (
        <div className="dialog-overlay" onClick={handleCancelImport}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <h3>Importar figurinhas que faltam</h3>
            <p>
              Cole aqui a lista de códigos das figurinhas que faltam, separadas por vírgula.
              <br />
              (Se vazio, marca todas como tenho)
            </p>
            <textarea
              className="import-textarea"
              placeholder="Ex: GER 5, BRA 10, ARG 3"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={4}
            />
            <div className="dialog-actions">
              <button
                type="button"
                className="btn-cancelar"
                onClick={handleCancelImport}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-confirmar"
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