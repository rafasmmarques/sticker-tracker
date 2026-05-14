type AppHeroProps = {
  onSaveCollection: () => Promise<void>;
  isSavingCollection: boolean;
  onOpenMarkAllDialog?: () => void;
};

export function AppHero({
  onSaveCollection,
  isSavingCollection,
  onOpenMarkAllDialog,
}: AppHeroProps) {
  return (
    <section className="app-hero">
      <div className="app-hero__content">
        <span className="eyebrow">Coleção 2026</span>

        <h1>Minha Coleção 2026</h1>

        <p>
          Organize sua coleção, acompanhe o que falta e descubra rapidamente
          quais figurinhas você tem repetidas para trocar.
        </p>

        <div className="app-hero__actions">
          <button
            className="primary-link"
            type="button"
            onClick={onOpenMarkAllDialog}
          >
            Marcar Todas
          </button>

          <button
            className="ghost-button"
            type="button"
            disabled={isSavingCollection}
            onClick={() => {
              void onSaveCollection();
            }}
          >
            {isSavingCollection ? "Salvando..." : "Salvar coleção"}
          </button>
        </div>
      </div>
    </section>
  );
}
