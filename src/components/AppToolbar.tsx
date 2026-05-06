import { useState, useRef, useEffect } from "react";
import type { GroupOption } from "./CollectionToolbar";

type AppToolbarProps = {
  search: string;
  onSearchChange: (search: string) => void;
  showOnlyMissing: boolean;
  onShowOnlyMissingChange: (show: boolean) => void;
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  groups: GroupOption[];
  onCopyMissingStickers: () => void;
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
  onCopyMissingStickers,
  onOpenImportDialog,
  isCondensedMode,
  onCondensedModeChange,
}: AppToolbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
                  onCopyMissingStickers();
                  setIsMenuOpen(false);
                }}
              >
                <span aria-hidden="true">📋</span>
                <span>Copiar Lista de Faltantes</span>
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
    </div>
  );
}