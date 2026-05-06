import type { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import {
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from "../services/authService";
import { getProfile, updateTradeLink } from "../services/profileService";
import { useToast } from "../hooks/useToast";
import type { GroupOption } from "./CollectionToolbar";

type AppNavbarProps = {
  user: User | null;
  search: string;
  onSearchChange: (search: string) => void;
  showOnlyMissing: boolean;
  onShowOnlyMissingChange: (show: boolean) => void;
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  groups: GroupOption[];
  onCopyMissingStickers: () => void;
  onOpenImportDialog: () => void;
  isCondensedMode: boolean;
  onCondensedModeChange: (condensed: boolean) => void;
};

type AuthMode = "login" | "register";

export function AppNavbar({
  user,
  search,
  onSearchChange,
  showOnlyMissing,
  onShowOnlyMissingChange,
  selectedGroup,
  onGroupChange,
  groups,
  onCopyMissingStickers,
  onOpenImportDialog,
  isCondensedMode,
  onCondensedModeChange,
}: AppNavbarProps) {
  const { showToast } = useToast();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tradeUsername, setTradeUsername] = useState("");
  const [tradeLinkAtivo, setTradeLinkAtivo] = useState(false);
  const [isLoadingTrade, setIsLoadingTrade] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthOpen && !isFiltersOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const filtersButton = document.querySelector(".navbar-button");
      const hamburgerButton = document.querySelector(".hamburger-button");
      const filtersDropdown = document.querySelector(".navbar-dropdown--filters");
      const authDropdown = document.querySelector(".auth-dropdown");

      const clickedButton = filtersButton?.contains(target) || hamburgerButton?.contains(target);
      const clickedFilters = filtersDropdown?.contains(target);
      const clickedAuth = authDropdown?.contains(target);

      if (!clickedButton && !clickedFilters && !clickedAuth) {
        setIsAuthOpen(false);
        setIsFiltersOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAuthOpen, isFiltersOpen]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const userId: string = user.id;
    let cancelled = false;

    async function loadProfile() {
      try {
        const profile = await getProfile(userId);
        if (cancelled) return;
        if (profile) {
          setTradeUsername(profile.username ?? "");
          setTradeLinkAtivo(profile.linkAtivo);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setProfileLoaded(true);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleSaveTradeLink() {
    if (!user) return;

    const trimmedUsername = tradeUsername.trim().toLowerCase();

    if (trimmedUsername && !/^[a-z0-9_]{3,20}$/.test(trimmedUsername)) {
      showToast({
        title: "Nome inválido.",
        description: "Use 3-20 letras, números ou underscore.",
        variant: "error",
      });
      return;
    }

    try {
      setIsLoadingTrade(true);
      await updateTradeLink(user.id, trimmedUsername || null, tradeLinkAtivo);

      showToast({
        title: "Link salvo.",
        description: tradeLinkAtivo
          ? `Seu link de trocas está ativo: /trocas/${trimmedUsername}`
          : "Link de trocas desativado.",
        variant: "success",
      });
    } catch (error) {
      showToast({
        title: "Erro ao salvar.",
        description:
          error instanceof Error ? error.message : "Tente novamente.",
        variant: "error",
      });
    } finally {
      setIsLoadingTrade(false);
    }
  }

  async function handleCopyTradeLink() {
    if (!tradeUsername || !tradeLinkAtivo) return;

    const url = `${window.location.origin}/trocas/${tradeUsername}`;
    await navigator.clipboard.writeText(url);

    showToast({
      title: "Link copiado.",
      description: "Compartilhe com seus amigos.",
      variant: "success",
    });
  }

  async function submitLogin() {
    try {
      setIsSubmitting(true);

      await signInWithEmail(loginEmail, loginPassword);

      showToast({
        title: "Login realizado com sucesso.",
        description: "Sua coleção será sincronizada automaticamente.",
        variant: "success",
      });

      setLoginPassword("");
      setIsAuthOpen(false);
    } catch (error) {
      showToast({
        title: "Não foi possível entrar.",
        description:
          error instanceof Error
            ? error.message
            : "Tente novamente em instantes.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitRegister() {
    try {
      setIsSubmitting(true);

      await signUpWithEmail(registerEmail, registerPassword);

      showToast({
        title: "Conta criada.",
        description:
          "Confirme seu e-mail para entrar. Confira também a caixa de spam.",
        variant: "success",
      });

      setRegisterPassword("");
      setMode("login");
    } catch (error) {
      showToast({
        title: "Não foi possível criar a conta.",
        description:
          error instanceof Error
            ? error.message
            : "Tente novamente em instantes.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    try {
      setIsSubmitting(true);

      await signOut();

      showToast({
        title: "Você saiu da conta.",
        description: "Sua coleção continua salva neste navegador.",
        variant: "info",
      });

      setIsAuthOpen(false);
    } catch (error) {
      showToast({
        title: "Não foi possível sair.",
        description:
          error instanceof Error
            ? error.message
            : "Tente novamente em instantes.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <nav className="app-navbar" aria-label="Menu principal">
      <div className="app-navbar__left">
        <button
          className={`navbar-button ${isFiltersOpen ? "active" : ""}`}
          type="button"
          aria-label={isFiltersOpen ? "Fechar filtros" : "Abrir filtros"}
          aria-expanded={isFiltersOpen}
          onClick={() => {
            if (isAuthOpen) setIsAuthOpen(false);
            setIsFiltersOpen((prev) => !prev);
          }}
        >
          {isFiltersOpen ? <span>✕</span> : <><span className="icon" aria-hidden="true">⚙</span><span>Filtros</span></>}
        </button>
      </div>

      <div className="app-navbar__right">
        <button
          className="hamburger-button"
          type="button"
          aria-label={isAuthOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isAuthOpen}
          onClick={() => {
            if (isFiltersOpen) setIsFiltersOpen(false);
            setIsAuthOpen((prev) => !prev);
          }}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {isFiltersOpen && (
        <div className="navbar-dropdown navbar-dropdown--filters">
          <div className="navbar-dropdown__inner">
            <label className="navbar-dropdown__search">
              <span aria-hidden="true">🔍</span>
              <input
                type="search"
                placeholder="Buscar figurinha..."
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                aria-label="Buscar por código, seleção ou jogador"
              />
            </label>

            <div className="navbar-dropdown__filters">
              <label className="checkbox-filtro">
                <input
                  type="checkbox"
                  checked={showOnlyMissing}
                  onChange={(e) => onShowOnlyMissingChange(e.target.checked)}
                />
                <span>Faltando</span>
              </label>

              <div className="view-toggle">
                <button
                  type="button"
                  className={`view-toggle__btn ${!isCondensedMode ? "view-toggle__btn--active" : ""}`}
                  onClick={() => onCondensedModeChange(false)}
                >
                  Cards
                </button>
                <button
                  type="button"
                  className={`view-toggle__btn ${isCondensedMode ? "view-toggle__btn--active" : ""}`}
                  onClick={() => onCondensedModeChange(true)}
                >
                  Lista
                </button>
              </div>

              <select
                className="select-grupo"
                value={selectedGroup}
                onChange={(e) => onGroupChange(e.target.value)}
                aria-label="Filtrar por seleção"
              >
                <option value="">Seleção</option>
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
            </div>

            <div className="navbar-dropdown__actions">
              <button
                type="button"
                className="toolbar-action-btn"
                onClick={() => {
                  onCopyMissingStickers();
                  setIsFiltersOpen(false);
                }}
              >
                <span aria-hidden="true">📋</span><span>Copiar</span>
              </button>

              <button
                type="button"
                className="toolbar-action-btn"
                onClick={() => {
                  onOpenImportDialog();
                  setIsFiltersOpen(false);
                }}
              >
                <span aria-hidden="true">📥</span><span>Importar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isAuthOpen && (
        <div className="auth-dropdown">
          {user ? (
            <div className="auth-dropdown__content">
              <strong>Conta conectada</strong>

              <p className="auth-dropdown__hint">
                Sua coleção pode ser salva na nuvem e acessada em outros
                dispositivos.
              </p>

              {profileLoaded && (
                <div className="trade-link-section">
                  <label className="trade-link-section__label">
                    Link de trocas
                  </label>

                  <div className="trade-link-section__input-row">
                    <span className="trade-link-section__prefix">
                      /trocas/
                    </span>
                    <input
                      type="text"
                      className="trade-link-section__input"
                      placeholder="seu-nome"
                      value={tradeUsername}
                      onChange={(e) =>
                        setTradeUsername(e.target.value.replace(/\s/g, ""))
                      }
                      maxLength={20}
                    />
                  </div>

                  <label className="trade-link-section__checkbox">
                    <input
                      type="checkbox"
                      checked={tradeLinkAtivo}
                      onChange={(e) => setTradeLinkAtivo(e.target.checked)}
                    />
                    <span>Ativar link de trocas</span>
                  </label>

                  <div className="trade-link-section__actions">
                    <button
                      type="button"
                      className="trade-link-section__save"
                      onClick={handleSaveTradeLink}
                      disabled={isLoadingTrade}
                    >
                      {isLoadingTrade ? "Salvando..." : "Salvar"}
                    </button>

                    {tradeLinkAtivo && tradeUsername && (
                      <button
                        type="button"
                        className="trade-link-section__copy"
                        onClick={handleCopyTradeLink}
                      >
                        Copiar link
                      </button>
                    )}
                  </div>
                </div>
              )}

              <button
                className="auth-dropdown__primary-action"
                type="button"
                disabled={isSubmitting}
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="auth-dropdown__content">
              <div
                className={[
                  "auth-mode-toggle",
                  mode === "register" ? "auth-mode-toggle--register" : "",
                ].join(" ")}
              >
                <button
                  type="button"
                  aria-pressed={mode === "login"}
                  onClick={() => setMode("login")}
                >
                  Entrar
                </button>

                <button
                  type="button"
                  aria-pressed={mode === "register"}
                  onClick={() => setMode("register")}
                >
                  Criar conta
                </button>
              </div>

              <div
                className={[
                  "auth-slider",
                  mode === "register" ? "auth-slider--register" : "",
                ].join(" ")}
              >
                <div className="auth-slider__track">
                  <section
                    className="auth-pane"
                    aria-hidden={mode !== "login"}
                  >
                    <div className="auth-pane__inner">
                      <div className="auth-pane__title">
                        <strong>Entrar na conta</strong>
                        <span>
                          Acesse sua coleção salva e continue de onde parou.
                        </span>
                      </div>

                      <form
                        className="auth-dropdown__form"
                        onSubmit={(event) => {
                          event.preventDefault();
                          void submitLogin();
                        }}
                      >
                        <input
                          type="email"
                          placeholder="Seu e-mail"
                          value={loginEmail}
                          autoComplete="email"
                          required
                          tabIndex={mode === "login" ? 0 : -1}
                          onChange={(event) =>
                            setLoginEmail(event.target.value)
                          }
                        />

                        <input
                          type="password"
                          placeholder="Sua senha"
                          value={loginPassword}
                          autoComplete="current-password"
                          minLength={6}
                          required
                          tabIndex={mode === "login" ? 0 : -1}
                          onChange={(event) =>
                            setLoginPassword(event.target.value)
                          }
                        />

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          tabIndex={mode === "login" ? 0 : -1}
                        >
                          Entrar
                        </button>
                      </form>
                    </div>
                  </section>

                  <section
                    className="auth-pane"
                    aria-hidden={mode !== "register"}
                  >
                    <div className="auth-pane__inner">
                      <div className="auth-pane__title">
                        <strong>Criar conta</strong>
                        <span>
                          Salve sua coleção na nuvem para usar em qualquer
                          dispositivo.
                        </span>
                      </div>

                      <form
                        className="auth-dropdown__form"
                        onSubmit={(event) => {
                          event.preventDefault();
                          void submitRegister();
                        }}
                      >
                        <input
                          type="email"
                          placeholder="Seu e-mail"
                          value={registerEmail}
                          autoComplete="email"
                          required
                          tabIndex={mode === "register" ? 0 : -1}
                          onChange={(event) =>
                            setRegisterEmail(event.target.value)
                          }
                        />

                        <input
                          type="password"
                          placeholder="Crie uma senha"
                          value={registerPassword}
                          autoComplete="new-password"
                          minLength={6}
                          required
                          tabIndex={mode === "register" ? 0 : -1}
                          onChange={(event) =>
                            setRegisterPassword(event.target.value)
                          }
                        />

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          tabIndex={mode === "register" ? 0 : -1}
                        >
                          Criar conta
                        </button>
                      </form>
                    </div>
                  </section>
                </div>
              </div>

              <p className="auth-dropdown__hint">
                Cadastre-se para salvar sua coleção e continuar de onde parou.
              </p>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
