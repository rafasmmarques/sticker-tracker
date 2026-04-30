import type { CollectionSummary } from "../types/sticker";

type CollectionStatsProps = {
  summary: CollectionSummary;
};

export function CollectionStats({ summary }: CollectionStatsProps) {
  return (
    <section className="stats-grid" aria-label="Resumo da coleção">
      <article className="stat-card stat-card--primary">
        <span>Progresso</span>
        <strong>{summary.completionPercentage}%</strong>
        <small>{summary.ownedCount} figurinhas marcadas</small>
      </article>

      <article className="stat-card">
        <span>Faltam</span>
        <strong>{summary.missingCount}</strong>
        <small>figurinhas para completar</small>
      </article>

      <article className="stat-card">
        <span>Repetidas</span>
        <strong>{summary.repeatedCount}</strong>
        <small>disponíveis para troca</small>
      </article>
    </section>
  );
}
