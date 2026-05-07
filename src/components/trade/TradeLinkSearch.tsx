import { useState } from "react";
import { getPublicProfileByUsername } from "../../services/profileService";
import { showToast } from "../../utils/toast";
import "../../styles/trade-link-search.css";

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
    <div className="trade-link-search">
      <label className="trade-link-search__label">
        Comparar com outra coleção
      </label>
      <div className="trade-link-search__input-group">
        <span className="trade-link-search__prefix">/trocas/</span>
        <input
          type="text"
          className="trade-link-search__input"
          placeholder="nome-do-amigo"
          value={username}
          onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
          onKeyDown={handleKeyDown}
          maxLength={24}
        />
        <button
          type="button"
          className="trade-link-search__btn"
          onClick={handleSearch}
          disabled={isSearching || username.trim().length < 3}
        >
          {isSearching ? "..." : "Comparar"}
        </button>
      </div>
    </div>
  );
}