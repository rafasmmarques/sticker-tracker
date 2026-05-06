import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { faBars, faGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from "../services/authService";
import { getProfile, updateTradeLink } from "../services/profileService";
import { useToast } from "../hooks/useToast";
import type { GroupOption } from "./CollectionToolbar";
import {
  NavbarIconButton,
  FiltersDropdown,
  LoggedUserPanel,
  AnonymousAuthPanel,
} from "./navbar";

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
type OpenDropdown = "filters" | "auth" | null;

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

const dropdownPanelClass =
  "absolute left-0 right-0 top-full z-[60] mt-2 rounded-2xl border border-black/10 bg-white/95 p-4 shadow-2xl backdrop-blur-md animate-fade-in";

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

  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
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

  const isFiltersOpen = openDropdown === "filters";
  const isAuthOpen = openDropdown === "auth";

  useEffect(() => {
    if (!user?.id) {
      setTradeUsername("");
      setTradeLinkAtivo(false);
      setProfileLoaded(false);
      return;
    }

    const userId = user.id;
    let cancelled = false;

    async function loadProfile() {
      try {
        setProfileLoaded(false);
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
  }, [user?.id]);

  function toggleDropdown(dropdown: Exclude<OpenDropdown, null>) {
    setOpenDropdown((currentDropdown) =>
      currentDropdown === dropdown ? null : dropdown
    );
  }

  async function handleSaveTradeLink() {
    if (!user) return;

    const trimmedUsername = tradeUsername.trim().toLowerCase();

    if (tradeLinkAtivo && !trimmedUsername) {
      showToast({
        title: "Informe um nome para o link.",
        description: "Esse nome será usado no seu link de trocas.",
        variant: "error",
      });
      return;
    }

    if (trimmedUsername && !USERNAME_REGEX.test(trimmedUsername)) {
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
      setTradeUsername(trimmedUsername);
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
        description: error instanceof Error ? error.message : "Tente novamente.",
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
      setOpenDropdown(null);
    } catch (error) {
      showToast({
        title: "Não foi possível entrar.",
        description: error instanceof Error ? error.message : "Tente novamente em instantes.",
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
        description: "Confirme seu e-mail para entrar. Veja a caixa de spam.",
        variant: "success",
      });
      setRegisterPassword("");
      setMode("login");
    } catch (error) {
      showToast({
        title: "Não foi possível criar a conta.",
        description: error instanceof Error ? error.message : "Tente novamente em instantes.",
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
      setOpenDropdown(null);
    } catch (error) {
      showToast({
        title: "Não foi possível sair.",
        description: error instanceof Error ? error.message : "Tente novamente em instantes.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {openDropdown && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default bg-transparent"
          aria-label="Fechar menu"
          onClick={() => setOpenDropdown(null)}
        />
      )}

      <nav
        className="sticky top-0 z-50 mb-2 flex w-full items-start justify-between gap-2 rounded-2xl bg-white/95 p-2 shadow-lg backdrop-blur-md"
        aria-label="Menu principal"
      >
        <NavbarIconButton
          isActive={isFiltersOpen}
          activeLabel="Fechar filtros"
          inactiveLabel="Abrir filtros"
          icon={isFiltersOpen ? faXmark : faGear}
          onClick={() => toggleDropdown("filters")}
        />

        <NavbarIconButton
          isActive={isAuthOpen}
          activeLabel="Fechar menu"
          inactiveLabel="Abrir menu"
          icon={isAuthOpen ? faXmark : faBars}
          onClick={() => toggleDropdown("auth")}
        />

        {isFiltersOpen && (
          <FiltersDropdown
            search={search}
            onSearchChange={onSearchChange}
            showOnlyMissing={showOnlyMissing}
            onShowOnlyMissingChange={onShowOnlyMissingChange}
            selectedGroup={selectedGroup}
            onGroupChange={onGroupChange}
            groups={groups}
            onCopyMissingStickers={() => {
              onCopyMissingStickers();
              setOpenDropdown(null);
            }}
            onOpenImportDialog={() => {
              onOpenImportDialog();
              setOpenDropdown(null);
            }}
            isCondensedMode={isCondensedMode}
            onCondensedModeChange={onCondensedModeChange}
          />
        )}

        {isAuthOpen && (
          <div className={dropdownPanelClass}>
            {user ? (
              <LoggedUserPanel
                user={user}
                profileLoaded={profileLoaded}
                tradeUsername={tradeUsername}
                tradeLinkAtivo={tradeLinkAtivo}
                isLoadingTrade={isLoadingTrade}
                isSubmitting={isSubmitting}
                onTradeUsernameChange={setTradeUsername}
                onTradeLinkAtivoChange={setTradeLinkAtivo}
                onSaveTradeLink={handleSaveTradeLink}
                onCopyTradeLink={handleCopyTradeLink}
                onLogout={handleLogout}
              />
            ) : (
              <AnonymousAuthPanel
                mode={mode}
                loginEmail={loginEmail}
                loginPassword={loginPassword}
                registerEmail={registerEmail}
                registerPassword={registerPassword}
                isSubmitting={isSubmitting}
                onModeChange={setMode}
                onLoginEmailChange={setLoginEmail}
                onLoginPasswordChange={setLoginPassword}
                onRegisterEmailChange={setRegisterEmail}
                onRegisterPasswordChange={setRegisterPassword}
                onLoginSubmit={submitLogin}
                onRegisterSubmit={submitRegister}
              />
            )}
          </div>
        )}
      </nav>
    </>
  );
}