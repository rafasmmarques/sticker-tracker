import { useState } from "react";
import { getPublicProfileByUsername } from "../../services/profileService";
import { showToast } from "../../utils/toast";

export function TradeLinkSearch() {
  const [username, setUsername] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch() {
    const normalized = username.trim().toLowerCase().replace(/\s/g, "");

    if (!normalized || normalized.length < 3 || normalized.length > 24) {
      showToast({
        title: "Nome inválido.",
        description: "Use 3-24 letras, números ou underscore.",
        variant: "error",
      });
      return;
    }

    if (!/^[a-z0-9_]+$/.test(normalized)) {
      showToast({
        title: "Caracteres inválidos.",
        description: "Use apenas letras, números e underscore.",
        variant: "error",
      });
      return;
    }

    try {
      setIsSearching(true);
      const profile = await getPublicProfileByUsername(normalized);

      if (!profile) {
        showToast({
          title: "Link de troca não encontrado.",
          description: "Verifique o nome ou o link pode estar desativado.",
          variant: "error",
        });
        return;
      }

      window.open(`/trocas/${normalized}?comparar=1`, "_blank");
      setUsername("");
    } catch {
      showToast({
        title: "Erro ao buscar.",
        description: "Tente novamente.",
        variant: "error",
      });
    } finally {
      setIsSearching(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      void handleSearch();
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-4 shadow-sm">
      <label className="block text-sm font-bold text-[var(--color-ink)] mb-2">
        Comparar com outra coleção
      </label>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-stretch">
        <div className="flex min-w-0 flex-1 items-center">
          <span className="flex min-h-[42px] items-center whitespace-nowrap rounded-l-lg border border-r-0 border-[var(--color-border)] bg-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-muted)]">
            /trocas/
          </span>
          <input
            type="text"
            className="min-w-0 flex-1 rounded-r-lg border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none sm:rounded-r-none sm:border-l-0"
            placeholder="nome-do-amigo"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
            onKeyDown={handleKeyDown}
            maxLength={24}
          />
        </div>
        <button
          type="button"
          className="min-h-[42px] w-full rounded-lg bg-[var(--color-navy)] px-4 text-sm font-bold whitespace-nowrap text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[100px] sm:rounded-l-none"
          onClick={handleSearch}
          disabled={isSearching || username.trim().length < 3}
        >
          {isSearching ? "..." : "Comparar"}
        </button>
      </div>
    </div>
  );
}
