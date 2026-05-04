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
}: CollectionToolbarProps) {
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
    </section>
  );
}
