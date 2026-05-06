import type { User } from "@supabase/supabase-js";

type LoggedUserPanelProps = {
  user: User;
  profileLoaded: boolean;
  tradeUsername: string;
  tradeLinkAtivo: boolean;
  isLoadingTrade: boolean;
  isSubmitting: boolean;
  onTradeUsernameChange: (username: string) => void;
  onTradeLinkAtivoChange: (active: boolean) => void;
  onSaveTradeLink: () => void;
  onCopyTradeLink: () => void;
  onLogout: () => void;
};

export function LoggedUserPanel({
  user: _user,
  profileLoaded,
  tradeUsername,
  tradeLinkAtivo,
  isLoadingTrade,
  isSubmitting,
  onTradeUsernameChange,
  onTradeLinkAtivoChange,
  onSaveTradeLink,
  onCopyTradeLink,
  onLogout,
}: LoggedUserPanelProps) {
  const primaryButtonClass =
    "inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-navy)] px-5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

  const secondaryButtonClass =
    "inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-bold text-[var(--color-navy)] transition hover:bg-[var(--color-navy)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <strong className="text-lg font-black text-[var(--color-ink)]">Conta conectada</strong>
        <p className="text-sm font-medium leading-relaxed text-slate-500">
          Sua coleção pode ser salva na nuvem e acessada em outros dispositivos.
        </p>
      </div>

      {profileLoaded ? (
        <div className="grid gap-3 rounded-2xl border border-black/10 bg-slate-50/80 p-3">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-wide text-slate-500">Link de trocas</span>
            <div className="flex h-11 items-center overflow-hidden rounded-full border border-black/10 bg-white">
              <span className="border-r border-black/10 px-3 text-sm font-bold text-slate-500">/trocas/</span>
              <input
                type="text"
                className="min-w-0 flex-1 bg-transparent px-3 text-sm font-bold text-[var(--color-ink)] outline-none"
                placeholder="seu-nome"
                value={tradeUsername}
                maxLength={20}
                onChange={(event) => onTradeUsernameChange(event.target.value.replace(/\s/g, ""))}
              />
            </div>
          </label>

          <label className="flex cursor-pointer select-none items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
            <input
              type="checkbox"
              checked={tradeLinkAtivo}
              onChange={(event) => onTradeLinkAtivoChange(event.target.checked)}
              className="h-5 w-5 cursor-pointer accent-[var(--color-navy)]"
            />
            <span>Ativar link de trocas</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" className={primaryButtonClass} onClick={onSaveTradeLink} disabled={isLoadingTrade}>
              {isLoadingTrade ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" className={secondaryButtonClass} onClick={onCopyTradeLink} disabled={!tradeLinkAtivo || !tradeUsername}>
              Copiar
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-black/10 bg-slate-50/80 p-3 text-sm font-semibold text-slate-500">
          Carregando dados do perfil...
        </div>
      )}

      <button type="button" className={secondaryButtonClass} disabled={isSubmitting} onClick={onLogout}>
        Sair
      </button>
    </div>
  );
}