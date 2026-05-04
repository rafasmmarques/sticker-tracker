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
}: CollectionToolbarProps) {
  const [showMarkAllDialog, setShowMarkAllDialog] = useState(false);
  const [isCheckedMarkAll, setIsCheckedMarkAll] = useState(false);

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

  return (
    <section className="collection-toolbar" aria-label="Filtros da coleção">
      <div>
        <span className="section-kicker">Minha coleção</span>
        <h2>Marque suas figurinhas</h2>
      </div>

      <div className="collection-toolbar__controls">
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
    </section>
  );
}
