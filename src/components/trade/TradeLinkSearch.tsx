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
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-2xl shadow-sm">
      <label className="block text-sm font-bold text-[var(--color-ink)] mb-2">
        Comparar com outra coleção
      </label>
      <div className="flex items-stretch w-full">
        <div className="flex items-center flex-1">
          <span className="px-3 py-2.5 bg-[var(--color-border)] rounded-l-lg border border-r-0 border-[var(--color-border)] text-sm text-[var(--color-muted)] whitespace-nowrap">
            /trocas/
          </span>
          <input
            type="text"
            className="flex-1 min-h-[42px] px-3 border-y border-[var(--color-border)] outline-none text-sm text-[var(--color-ink)]"
            placeholder="nome-do-amigo"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
            onKeyDown={handleKeyDown}
            maxLength={24}
          />
        </div>
        <button
          type="button"
          className="min-w-[100px] min-h-[42px] bg-[var(--color-navy)] text-white rounded-r-lg border-r border-[var(--color-border)] text-sm font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          onClick={handleSearch}
          disabled={isSearching || username.trim().length < 3}
        >
          {isSearching ? "..." : "Comparar"}
        </button>
      </div>
    </div>
  );
}