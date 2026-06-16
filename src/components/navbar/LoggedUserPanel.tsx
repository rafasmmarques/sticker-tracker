import { useState } from "react";
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
  onClearCollection: () => void;
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
  onClearCollection,
}: LoggedUserPanelProps) {
  const [showResetDialog, setShowResetDialog] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _userId, email: _userEmail } = _user;

  const primaryButtonClass =
    "inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-navy)] px-5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

  const secondaryButtonClass =
    "inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-bold text-[var(--color-navy)] transition hover:bg-[var(--color-navy)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60";

  const dangerButtonClass =
    "inline-flex h-11 w-full items-center justify-center rounded-full border-2 border-red-600 px-5 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60";

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

          <p className="text-xs font-semibold leading-relaxed text-slate-500">
            Ao ativar, seu @nome, resumo da coleção, faltantes e repetidas ficam públicos para quem acessar o link.
          </p>

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

      {showResetDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowResetDialog(false)}>
          <div className="mx-4 w-full max-w-xs rounded-2xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-lg font-black text-[var(--color-ink)]">Zerar coleção?</h3>
            <p className="mb-4 text-sm text-slate-500">
              Tem certeza que deseja <strong>apagar todos as figurinhas</strong> da sua coleção?
              Esta ação não pode ser desfeita.
            </p>
            <div className="grid gap-2">
              <button
                type="button"
                className="h-10 w-full rounded-full bg-red-600 text-sm font-bold text-white transition hover:bg-red-700"
                onClick={() => {
                  onClearCollection();
                  setShowResetDialog(false);
                }}
              >
                Sim, zerar tudo
              </button>
              <button
                type="button"
                className="h-10 w-full rounded-full border border-slate-200 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
                onClick={() => setShowResetDialog(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <button type="button" className={dangerButtonClass} onClick={() => setShowResetDialog(true)}>
        Zerar Coleção
      </button>
      <button type="button" className={secondaryButtonClass} disabled={isSubmitting} onClick={onLogout}>
        Sair
      </button>
    </div>
  );
}
