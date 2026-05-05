import { useState } from "react";

type GroupOption = {
  letter: string;
  teams: { fifaCode: string; name: string }[];
};

type CollectionToolbarProps = {
  search: string;
  onSearchChange: (search: string) => void;
  onCopyMissingStickers: () => void;
  showOnlyMissing: boolean;
  onShowOnlyMissingChange: (show: boolean) => void;
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  groups: GroupOption[];
  onMarkAllStickers?: () => void;
  onClearCollection?: () => void;
  allStickersCount?: number;
  isCondensedMode?: boolean;
  onCondensedModeChange?: (condensed: boolean) => void;
  onImportList?: (missingCodes: string[]) => void;
  isMobile?: boolean;
};

export function CollectionToolbar({
  search,
  onSearchChange,
  onCopyMissingStickers,
  showOnlyMissing,
  onShowOnlyMissingChange,
  selectedGroup,
  onGroupChange,
  groups,
  onMarkAllStickers,
  onClearCollection,
  allStickersCount = 0,
  isCondensedMode = false,
  onCondensedModeChange,
  onImportList,
  isMobile = false,
}: CollectionToolbarProps) {
  const [showMarkAllDialog, setShowMarkAllDialog] = useState(false);
  const [isCheckedMarkAll, setIsCheckedMarkAll] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importText, setImportText] = useState("");

  const viewModeLabel = isMobile ? "Visualização em Lista" : "Visualização em Cards";

  const handleMarkAllToggle = (checked: boolean) => {
    if (!checked) {
      setIsCheckedMarkAll(false);
      return;
    }
    setIsCheckedMarkAll(true);
    setShowMarkAllDialog(true);
  };

  const handleConfirmMarkAll = () => {
    onMarkAllStickers?.();
    setShowMarkAllDialog(false);
    setIsCheckedMarkAll(false);
  };

  const handleClearCollection = () => {
    onClearCollection?.();
    setShowMarkAllDialog(false);
    setIsCheckedMarkAll(false);
  };

  const handleCancelDialog = () => {
    setShowMarkAllDialog(false);
    setIsCheckedMarkAll(false);
  };

  const handleImportSubmit = () => {
    onImportList?.(importText.split(",").map((s) => s.trim()).filter(Boolean));
    setShowImportDialog(false);
    setImportText("");
  };

  const handleCancelImport = () => {
    setShowImportDialog(false);
    setImportText("");
  };

  return (
    <section className="collection-toolbar" aria-label="Filtros da coleção">
      <div>
        <span className="section-kicker">Minha coleção</span>
        <h2>Marque suas figurinhas</h2>
      </div>

<div className="collection-toolbar__controls">
        {onCondensedModeChange && (
          <label className="checkbox-filtro">
            <input
              type="checkbox"
              checked={isCondensedMode}
              onChange={(e) => onCondensedModeChange(e.target.checked)}
            />
            <span>{viewModeLabel}</span>
          </label>
        )}

        <label className="checkbox-filtro">
          <input
            type="checkbox"
            checked={showOnlyMissing}
            onChange={(e) => onShowOnlyMissingChange(e.target.checked)}
          />
          <span>Faltando</span>
        </label>

        {onMarkAllStickers && (
          <label className="checkbox-filtro">
            <input
              type="checkbox"
              checked={isCheckedMarkAll}
              onChange={(e) => handleMarkAllToggle(e.target.checked)}
            />
            <span>Marcar todas</span>
          </label>
        )}

        <select
          className="select-grupo"
          value={selectedGroup}
          onChange={(e) => onGroupChange(e.target.value)}
          aria-label="Filtrar por seleção"
        >
          <option value="">Todas as Seleções</option>
          <option value="specials">Especiais</option>
          {groups.map((group) => (
            <optgroup key={group.letter} label={`Grupo ${group.letter}`}>
              {group.teams.map((team) => (
                <option key={team.fifaCode} value={team.fifaCode}>
                  {team.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <input
          type="search"
          placeholder="Buscar por código, seleção ou jogador. Ex: GER 5"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <button type="button" onClick={onCopyMissingStickers}>
          Copiar lista
        </button>

        {onImportList && (
          <button
            type="button"
            className="btn-import"
            onClick={() => setShowImportDialog(true)}
          >
            Importar
          </button>
        )}
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
              Se vazio, marca todas como tenho.
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