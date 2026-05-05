import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import type { Sticker, StickerCollection } from "../types/sticker";
import {
  getPublicProfileByUsername,
  getPublicCollection,
} from "../services/profileService";
import { useStickerCatalog } from "../hooks/useStickerCatalog";
import {
  calculateCollectionSummary,
  getStickersWithoutQuantity,
  getRepeatedStickers,
} from "../utils/collection";
import { TradeComparison } from "../components/trade/TradeComparison";
import { useToast } from "../hooks/useToast";
import "../styles/trade-page.css";

type PublicTradePageProps = {
  userId?: string;
  collection?: StickerCollection;
  applyTrade?: (giveIds: number[], receiveIds: number[]) => void;
};

export function PublicTradePage({
  userId,
  collection,
  applyTrade,
}: PublicTradePageProps) {
  const params = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const username = params.username ?? "";
  const shouldCompare = searchParams.get("comparar") === "1";
  const { showToast } = useToast();
  const { stickers } = useStickerCatalog();

  const [publicCollection, setPublicCollection] =
    useState<StickerCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(shouldCompare);

  const initialError = !username ? "Nome de usuário não encontrado." : null;

  useEffect(() => {
    if (initialError) {
      return;
    }

    let cancelled = false;

    async function loadData() {
      try {
        if (cancelled) return;

        const profileData = await getPublicProfileByUsername(username);
        if (cancelled) return;

        if (!profileData) {
          setError("Este link de trocas não existe ou está desativado.");
          setIsLoading(false);
          return;
        }

        const collectionData = await getPublicCollection(profileData.id);
        if (cancelled) return;

        setPublicCollection(collectionData);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Não foi possível carregar os dados.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [username, initialError]);

  const displayError = error ?? initialError;

  const summary = useMemo(() => {
    if (!stickers.length || !publicCollection) {
      return null;
    }
    return calculateCollectionSummary(
      stickers,
      publicCollection,
      stickers.length
    );
  }, [stickers, publicCollection]);

  const missingStickers = useMemo(() => {
    if (!stickers.length || !publicCollection) {
      return [];
    }
    return getStickersWithoutQuantity(stickers, publicCollection);
  }, [stickers, publicCollection]);

  const repeatedStickers = useMemo(() => {
    if (!stickers.length || !publicCollection) {
      return [];
    }
    return getRepeatedStickers(stickers, publicCollection);
  }, [stickers, publicCollection]);

  async function copyList(
    stickerList: Sticker[],
    type: "missing" | "repeated"
  ) {
    const list = stickerList.map((s) => s.displayCode).join(", ");

    const text =
      type === "missing"
        ? `Figurinhas que faltam na coleção de ${username}: ${list}`
        : `Figurinhas repetidas na coleção de ${username}: ${list}`;

    await navigator.clipboard.writeText(text);

    showToast({
      title: "Lista copiada.",
      description: "Agora é só colar no WhatsApp.",
      variant: "success",
    });
  }

  async function copyShareLink() {
    const url = `${window.location.origin}/trocas/${username}`;
    await navigator.clipboard.writeText(url);

    showToast({
      title: "Link copiado.",
      description: "Compartilhe com seus amigos.",
      variant: "success",
    });
  }

  function shareOnWhatsApp() {
    const url = `${window.location.origin}/trocas/${username}`;
    const text = `Minhas figurinhas para troca: ${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }

  if (isLoading) {
    return (
      <div className="trade-page">
        <div className="trade-page__loading">
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  if (displayError) {
    return (
      <div className="trade-page">
        <div className="trade-page__error">
          <h1>Ops!</h1>
          <p>{displayError}</p>
          <Link to="/" className="trade-page__back-link">
            Voltar para minha coleção
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="trade-page">
      <header className="trade-page__header">
        <Link to="/" className="trade-page__logo">
          Sticker Tracker
        </Link>

        <div className="trade-page__user">
          <h1 className="trade-page__username">@{username}</h1>
          <p className="trade-page__subtitle">Coleção pública para trocas</p>
        </div>

        <div className="trade-page__actions">
          <button
            type="button"
            className="trade-page__btn trade-page__btn--secondary"
            onClick={copyShareLink}
          >
            Copiar link
          </button>
          <button
            type="button"
            className="trade-page__btn trade-page__btn--primary"
            onClick={shareOnWhatsApp}
          >
            Compartilhar
          </button>
        </div>
      </header>

      {summary && (
        <section className="trade-page__stats">
          <div className="trade-page__stat">
            <span className="trade-page__stat-value">
              {summary.completionPercentage}%
            </span>
            <span className="trade-page__stat-label">Completo</span>
          </div>
          <div className="trade-page__stat">
            <span className="trade-page__stat-value">{summary.ownedCount}</span>
            <span className="trade-page__stat-label">Tenho</span>
          </div>
          <div className="trade-page__stat">
            <span className="trade-page__stat-value">{summary.missingCount}</span>
            <span className="trade-page__stat-label">Faltam</span>
          </div>
          <div className="trade-page__stat">
            <span className="trade-page__stat-value">{summary.repeatedCount}</span>
            <span className="trade-page__stat-label">Repetidas</span>
          </div>
        </section>
      )}

      {userId && collection && publicCollection && Object.keys(collection).length > 0 && (
        <section className="trade-page__compare">
          {!showComparison ? (
            <button
              type="button"
              className="trade-page__btn trade-page__btn--highlight"
              onClick={() => setShowComparison(true)}
            >
              Comparar com minha coleção
            </button>
          ) : (
            <TradeComparison
              myCollection={collection}
              theirCollection={publicCollection}
              stickers={stickers}
              username={username!}
              onClose={() => setShowComparison(false)}
              onConfirmTrade={userId ? applyTrade : undefined}
            />
          )}
        </section>
      )}

      {!userId && collection && publicCollection && Object.keys(collection).length > 0 && (
        <section className="trade-page__compare">
          <div className="trade-page__login-prompt">
            <p>
              Você tem figurinhas salvas no navegador. Para comparar com esta coleção, faça login ou crie uma conta.
            </p>
            <Link to="/" className="trade-page__login-btn">
              Entrar ou criar conta
            </Link>
          </div>
        </section>
      )}

      <section className="trade-page__list">
        <div className="trade-page__list-header">
          <h2>Faltam ({missingStickers.length})</h2>
          {missingStickers.length > 0 && (
            <button
              type="button"
              className="trade-page__copy-btn"
              onClick={() => copyList(missingStickers, "missing")}
            >
              Copiar lista
            </button>
          )}
        </div>
        {missingStickers.length === 0 ? (
          <p className="trade-page__list-empty">Nenhuma figurinha faltando!</p>
        ) : (
          <div className="trade-page__stickers">
            {missingStickers.slice(0, 50).map((sticker) => (
              <span key={sticker.id} className="trade-page__sticker-badge">
                {sticker.displayCode}
              </span>
            ))}
            {missingStickers.length > 50 && (
              <span className="trade-page__sticker-more">
                +{missingStickers.length - 50} mais
              </span>
            )}
          </div>
        )}
      </section>

      <section className="trade-page__list">
        <div className="trade-page__list-header">
          <h2>Repetidas ({repeatedStickers.length})</h2>
          {repeatedStickers.length > 0 && (
            <button
              type="button"
              className="trade-page__copy-btn"
              onClick={() => copyList(repeatedStickers, "repeated")}
            >
              Copiar lista
            </button>
          )}
        </div>
        {repeatedStickers.length === 0 ? (
          <p className="trade-page__list-empty">
            Nenhuma figurinha repetida.
          </p>
        ) : (
          <div className="trade-page__stickers">
            {repeatedStickers.slice(0, 50).map((sticker) => (
              <span
                key={sticker.id}
                className="trade-page__sticker-badge trade-page__sticker-badge--repeated"
              >
                {sticker.displayCode}
              </span>
            ))}
            {repeatedStickers.length > 50 && (
              <span className="trade-page__sticker-more">
                +{repeatedStickers.length - 50} mais
              </span>
            )}
          </div>
        )}
      </section>
    </div>
  );
}