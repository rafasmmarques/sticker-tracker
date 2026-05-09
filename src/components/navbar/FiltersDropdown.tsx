import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCopy, faDownload, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FIFA_TO_ISO, WORLD_CUP_2026_TEAM_ORDER } from "../../utils/countryCodes";

type ExportListType = "missing" | "repeated";

type FiltersDropdownProps = {
  search: string;
  onSearchChange: (search: string) => void;
  showOnlyMissing: boolean;
  onShowOnlyMissingChange: (show: boolean) => void;
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  onExportList: (type: ExportListType) => void;
  onOpenImportDialog: () => void;
  isCondensedMode: boolean;
  onCondensedModeChange: (condensed: boolean) => void;
  onClose: () => void;
};

export function FiltersDropdown({
  search,
  onSearchChange,
  showOnlyMissing,
  onShowOnlyMissingChange,
  selectedGroup,
  onGroupChange,
  onExportList,
  onOpenImportDialog,
  isCondensedMode,
  onCondensedModeChange,
  onClose,
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
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onClose();
              }
            }}
            aria-label="Buscar por código, seleção ou jogador"
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-4 md:grid md:grid-cols-[minmax(180px,0.42fr)_minmax(0,1fr)] md:items-start md:gap-5">
          <div className="flex w-full items-center justify-between gap-4 md:flex-col md:items-start md:justify-start md:gap-4">
            <label className="flex cursor-pointer select-none items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
              <input
                type="checkbox"
                checked={showOnlyMissing}
                onChange={(event) => onShowOnlyMissingChange(event.target.checked)}
                className="h-5 w-5 cursor-pointer accent-[var(--color-navy)]"
              />
              <span>Faltando</span>
            </label>

            <div className="flex w-fit items-center gap-2 self-start">
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
          </div>

          <div className="w-full space-y-3 md:justify-self-end">
            <button
              type="button"
              className={`flex h-10 w-full items-center justify-center gap-2 rounded-lg border-2 transition-all ${
                selectedGroup === "specials"
                  ? "border-amber-400 bg-amber-50"
                  : "border-black/10 bg-white hover:border-black/20"
              }`}
              onClick={() => {
                onGroupChange(selectedGroup === "specials" ? "" : "specials");
                onClose();
              }}
              aria-label="Filtrar especiais"
            >
              <FontAwesomeIcon icon={faStar} className="text-amber-400" />
              <span className="text-sm font-bold text-[var(--color-ink)]">Especiais</span>
            </button>

            <div className="grid grid-cols-8 gap-1 md:grid-cols-12 md:gap-2 lg:grid-cols-16">
              {WORLD_CUP_2026_TEAM_ORDER.map((team) => {
                const isoCode = FIFA_TO_ISO[team.fifaCode]?.toLowerCase();
                const isSelected = selectedGroup === team.fifaCode;
                return (
                  <button
                    key={team.fifaCode}
                    type="button"
                    className={`aspect-[5/3] rounded border-2 transition-all ${
                      isSelected
                        ? "border-[var(--color-navy)] bg-blue-50"
                        : "border-transparent hover:border-black/20"
                    }`}
                    onClick={() => {
                      onGroupChange(isSelected ? "" : team.fifaCode);
                      onClose();
                    }}
                    aria-label={`Filtrar ${team.name}`}
                    title={team.name}
                  >
                    {isoCode && (
                      <img
                        src={`https://flagcdn.com/${isoCode}.svg`}
                        alt={team.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                );
              })}
            </div>
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
