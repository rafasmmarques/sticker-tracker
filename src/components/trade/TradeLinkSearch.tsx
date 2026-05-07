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
    <div className="flex flex-col gap-2 p-4 bg-white rounded-2xl shadow-sm">
      <label className="text-sm font-bold text-[var(--color-ink)]">
        Comparar com outra coleção
      </label>
      <div className="flex flex-col sm:flex-row items-stretch">
        <div className="flex items-center">
          <span className="px-3 py-2.5 bg-[var(--color-border)] rounded-l-full border border-r-0 border-[var(--color-border)] text-sm text-[var(--color-muted)] whitespace-nowrap">
            /trocas/
          </span>
          <input
            type="text"
            className="flex-1 min-h-[42px] px-1 border-y border-[var(--color-border)] outline-none text-sm text-[var(--color-ink)]"
            placeholder="nome-do-amigo"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
            onKeyDown={handleKeyDown}
            maxLength={24}
          />
        </div>
        <button
          type="button"
          className="mt-2 sm:mt-0 sm:px-4 min-h-[42px] bg-[var(--color-navy)] text-white rounded-b-xl sm:rounded-r-full sm:rounded-l-none text-sm font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSearch}
          disabled={isSearching || username.trim().length < 3}
        >
          {isSearching ? "..." : "Comparar"}
        </button>
      </div>
    </div>
  );
}