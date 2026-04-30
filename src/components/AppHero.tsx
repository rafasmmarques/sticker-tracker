import { BrandMark } from "./BrandMark";

type AppHeroProps = {
  onClearCollection: () => void;
};

export function AppHero({ onClearCollection }: AppHeroProps) {
  return (
    <section className="app-hero">
      <div className="app-hero__content">
        <span className="eyebrow">Coleção 2026</span>

        <h1>Sticker Tracker</h1>

        <p>
          Organize sua coleção, acompanhe o que falta e descubra rapidamente
          quais figurinhas você tem repetidas para trocar.
        </p>

        <div className="app-hero__actions">
          <a className="primary-link" href="#collection-grid">
            Ver coleção
          </a>

          <button
            className="ghost-button"
            type="button"
            onClick={onClearCollection}
          >
            Limpar coleção
          </button>
        </div>
      </div>

      <div className="app-hero__brand">
        <BrandMark variant="hero" />
      </div>
    </section>
  );
}
