type CollectionToolbarProps = {
  search: string;
  onSearchChange: (search: string) => void;
  onCopyMissingStickers: () => void;
};

export function CollectionToolbar({
  search,
  onSearchChange,
  onCopyMissingStickers,
}: CollectionToolbarProps) {
  return (
    <section className="collection-toolbar" aria-label="Filtros da coleção">
      <div>
        <span className="section-kicker">Minha coleção</span>
        <h2>Marque suas figurinhas</h2>
      </div>

      <div className="collection-toolbar__controls">
        <input
          type="search"
          placeholder="Buscar por número. Ex: 001"
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
