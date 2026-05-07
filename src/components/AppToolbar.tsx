import { useState, useRef, useEffect } from "react";
import type { GroupOption } from "./CollectionToolbar";

type ExportListType = "missing" | "repeated";

type AppToolbarProps = {
  search: string;
  onSearchChange: (search: string) => void;
  showOnlyMissing: boolean;
  onShowOnlyMissingChange: (show: boolean) => void;
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  groups: GroupOption[];
  onExportList: (type: ExportListType) => void;
  onOpenImportDialog: () => void;
  isCondensedMode: boolean;
  onCondensedModeChange: (condensed: boolean) => void;
};

export function AppToolbar({
  search,
  onSearchChange,
  showOnlyMissing,
  onShowOnlyMissingChange,
  selectedGroup,
  onGroupChange,
  groups,
  onExportList,
  onOpenImportDialog,
  isCondensedMode,
  onCondensedModeChange,
}: AppToolbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportType, setExportType] = useState<ExportListType>("missing");
  const menuRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    onExportList(exportType);
    setShowExportDialog(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="app-toolbar" ref={menuRef}>
      <button
        type="button"
        className="toolbar-trigger"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label={isMenuOpen ? "Fechar filtros" : "Abrir filtros"}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? (
          <span>✕</span>
        ) : (
          <>
            <span aria-hidden="true">⚙</span>
            <span>Filtros</span>
          </>
        )}
      </button>

      {isMenuOpen && (
        <div className="toolbar-dropdown">
          <div className="toolbar-dropdown__inner">
            <label className="toolbar-dropdown__search">
              <span aria-hidden="true">🔍</span>
              <input
                type="search"
                placeholder="Buscar"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                aria-label="Buscar por código, seleção ou jogador"
              />
            </label>

            <div className="toolbar-dropdown__filters">
              <label className="checkbox-filtro">
                <input
                  type="checkbox"
                  checked={showOnlyMissing}
                  onChange={(e) => onShowOnlyMissingChange(e.target.checked)}
                />
                <span>Faltando</span>
              </label>

              <label className="checkbox-filtro">
                <input
                  type="checkbox"
                  checked={isCondensedMode}
                  onChange={(e) => onCondensedModeChange(e.target.checked)}
                />
                <span>Lista</span>
              </label>

              <select
                className="select-grupo"
                value={selectedGroup}
                onChange={(e) => onGroupChange(e.target.value)}
                aria-label="Filtrar por seleção"
              >
                <option value="">Seleção</option>
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
            </div>

            <div className="toolbar-dropdown__actions">
              <button
                type="button"
                className="toolbar-action-btn"
                onClick={() => {
                  setShowExportDialog(true);
                  setIsMenuOpen(false);
                }}
              >
                <span aria-hidden="true">📋</span>
                <span>Exportar Lista</span>
              </button>

              <button
                type="button"
                className="toolbar-action-btn"
                onClick={() => {
                  onOpenImportDialog();
                  setIsMenuOpen(false);
                }}
              >
                <span aria-hidden="true">📥</span>
                <span>Importar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showExportDialog && (
        <div className="dialog-overlay" onClick={() => setShowExportDialog(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <h3>Exportar lista</h3>
            
            <label className="dialog-radio-option">
              <input
                type="radio"
                name="exportType"
                value="missing"
                checked={exportType === "missing"}
                onChange={() => setExportType("missing")}
              />
              <span>Lista das que faltam</span>
            </label>

            <label className="dialog-radio-option">
              <input
                type="radio"
                name="exportType"
                value="repeated"
                checked={exportType === "repeated"}
                onChange={() => setExportType("repeated")}
              />
              <span>Lista de repetidas</span>
            </label>

            <div className="dialog-actions">
              <button type="button" className="btn-cancelar" onClick={() => setShowExportDialog(false)}>
                Cancelar
              </button>
              <button type="button" className="btn-primario" onClick={handleExport}>
                Exportar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}