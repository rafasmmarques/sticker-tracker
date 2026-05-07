import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCopy, faDownload, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import type { GroupOption } from "../CollectionToolbar";

type ExportListType = "missing" | "repeated";

type FiltersDropdownProps = {
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

export function FiltersDropdown({
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
}: FiltersDropdownProps) {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportType, setExportType] = useState<ExportListType>("missing");

  const handleExport = () => {
    onExportList(exportType);
    setShowExportDialog(false);
  };

  const dropdownPanelClass =
    "absolute left-0 right-0 top-full z-[60] mt-2 rounded-2xl border border-black/10 bg-white/95 p-4 shadow-2xl backdrop-blur-md animate-fade-in";

  const secondaryButtonClass =
    "inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-bold text-[var(--color-navy)] transition hover:bg-[var(--color-navy)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className={dropdownPanelClass}>
      <div className="grid gap-4">
        <label className="flex h-12 items-center gap-3 rounded-full border border-black/10 bg-white px-4">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[var(--color-navy)]" />
          <input
            type="search"
            className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-[var(--color-ink)] outline-none placeholder:text-slate-400"
            placeholder="Buscar figurinha..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Buscar por código, seleção ou jogador"
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="flex cursor-pointer select-none items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
            <input
              type="checkbox"
              checked={showOnlyMissing}
              onChange={(event) => onShowOnlyMissingChange(event.target.checked)}
              className="h-5 w-5 cursor-pointer accent-[var(--color-navy)]"
            />
            <span>Faltando</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--color-ink)]">Cards</span>
            <button
              type="button"
              className="relative h-6 w-11 rounded-full bg-[var(--color-navy)] transition-colors duration-200"
              onClick={() => onCondensedModeChange(!isCondensedMode)}
              role="switch"
              aria-checked={isCondensedMode}
            >
              <span
                className={[
                  "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200",
                  isCondensedMode ? "translate-x-5" : "translate-x-0",
                ].join(" ")}
              />
            </button>
            <span className="text-xs font-semibold text-[var(--color-ink)]">Lista</span>
          </div>

          <div className="relative w-full">
            <select
              className="h-12 w-full appearance-none rounded-xl border border-black/10 bg-white px-4 pr-10 text-base font-semibold text-[var(--color-ink)] outline-none"
              value={selectedGroup}
              onChange={(event) => onGroupChange(event.target.value)}
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
            <FontAwesomeIcon icon={faChevronDown} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--color-navy)]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" className={secondaryButtonClass} onClick={() => setShowExportDialog(true)}>
            <FontAwesomeIcon icon={faCopy} />
            <span className="ml-2">Exportar</span>
          </button>
          <button type="button" className={secondaryButtonClass} onClick={onOpenImportDialog}>
            <FontAwesomeIcon icon={faDownload} />
            <span className="ml-2">Importar</span>
          </button>
        </div>
      </div>

      {showExportDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => setShowExportDialog(false)}>
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-black/10 bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-bold text-[var(--color-ink)]">Exportar lista</h3>
            
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 p-3 transition hover:bg-slate-50">
              <input
                type="radio"
                name="exportType"
                value="missing"
                checked={exportType === "missing"}
                onChange={() => setExportType("missing")}
                className="accent-[var(--color-navy)]"
              />
              <span className="text-sm font-semibold text-[var(--color-ink)]">Lista das que faltam</span>
            </label>

            <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 p-3 transition hover:bg-slate-50">
              <input
                type="radio"
                name="exportType"
                value="repeated"
                checked={exportType === "repeated"}
                onChange={() => setExportType("repeated")}
                className="accent-[var(--color-navy)]"
              />
              <span className="text-sm font-semibold text-[var(--color-ink)]">Lista de repetidas</span>
            </label>

            <div className="mt-5 flex gap-3">
              <button type="button" className="flex-1 rounded-full border border-black/10 py-3 text-sm font-bold text-[var(--color-ink)]" onClick={() => setShowExportDialog(false)}>
                Cancelar
              </button>
              <button type="button" className="flex-1 rounded-full bg-[var(--color-navy)] py-3 text-sm font-bold text-white" onClick={handleExport}>
                Exportar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}