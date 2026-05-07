import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { AuthModeToggle } from "./AuthModeToggle";
import { AuthPane } from "./AuthPane";

type AuthMode = "login" | "register";

type AnonymousAuthPanelProps = {
  mode: AuthMode;
  loginEmail: string;
  loginPassword: string;
  registerEmail: string;
  registerPassword: string;
  isSubmitting: boolean;
  onModeChange: (mode: AuthMode) => void;
  onLoginEmailChange: (email: string) => void;
  onLoginPasswordChange: (password: string) => void;
  onRegisterEmailChange: (email: string) => void;
  onRegisterPasswordChange: (password: string) => void;
  onLoginSubmit: () => void;
  onRegisterSubmit: () => void;
};

export function AnonymousAuthPanel({
  mode,
  loginEmail,
  loginPassword,
  registerEmail,
  registerPassword,
  isSubmitting,
  onModeChange,
  onLoginEmailChange,
  onLoginPasswordChange,
  onRegisterEmailChange,
  onRegisterPasswordChange,
  onLoginSubmit,
  onRegisterSubmit,
}: AnonymousAuthPanelProps) {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const inputClass =
    "h-12 w-full rounded-full border border-black/10 bg-white px-4 pr-12 text-sm font-semibold text-[var(--color-ink)] outline-none transition focus:border-[var(--color-navy)] focus:ring-4 focus:ring-[rgba(23,27,95,0.12)]";

  const primaryButtonClass =
    "inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--color-navy)] px-5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="grid gap-4">
      <AuthModeToggle mode={mode} onModeChange={onModeChange} />

      <div className="overflow-hidden">
        <div
          className={[
            "flex w-[200%] transition-transform duration-300 ease-out",
            mode === "register" ? "-translate-x-1/2" : "translate-x-0",
          ].join(" ")}
        >
          <AuthPane
            title="Entrar na conta"
            description="Acesse sua coleção salva e continue de onde parou."
            isActive={mode === "login"}
          >
            <form
              className="grid gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                void onLoginSubmit();
              }}
            >
              <input
                type="email"
                className={inputClass}
                placeholder="Seu e-mail"
                value={loginEmail}
                autoComplete="email"
                required
                tabIndex={mode === "login" ? 0 : -1}
                onChange={(event) => onLoginEmailChange(event.target.value)}
              />
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  className={inputClass}
                  placeholder="Sua senha"
                  value={loginPassword}
                  autoComplete="current-password"
                  minLength={6}
                  required
                  tabIndex={mode === "login" ? 0 : -1}
                  onChange={(event) => onLoginPasswordChange(event.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[var(--color-navy)]"
                  tabIndex={mode === "login" ? 0 : -1}
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <FontAwesomeIcon icon={showLoginPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              <button type="submit" className={primaryButtonClass} disabled={isSubmitting} tabIndex={mode === "login" ? 0 : -1}>
                Entrar
              </button>
            </form>
          </AuthPane>

          <AuthPane
            title="Criar conta"
            description="Salve sua coleção na nuvem para usar em qualquer dispositivo."
            isActive={mode === "register"}
          >
            <form
              className="grid gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                void onRegisterSubmit();
              }}
            >
              <input
                type="email"
                className={inputClass}
                placeholder="Seu e-mail"
                value={registerEmail}
                autoComplete="email"
                required
                tabIndex={mode === "register" ? 0 : -1}
                onChange={(event) => onRegisterEmailChange(event.target.value)}
              />
              <div className="relative">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  className={inputClass}
                  placeholder="Crie uma senha"
                  value={registerPassword}
                  autoComplete="new-password"
                  minLength={6}
                  required
                  tabIndex={mode === "register" ? 0 : -1}
                  onChange={(event) => onRegisterPasswordChange(event.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[var(--color-navy)]"
                  tabIndex={mode === "register" ? 0 : -1}
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  aria-label={showRegisterPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <FontAwesomeIcon icon={showRegisterPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              <button type="submit" className={primaryButtonClass} disabled={isSubmitting} tabIndex={mode === "register" ? 0 : -1}>
                Criar conta
              </button>
            </form>
          </AuthPane>
        </div>
      </div>

      <p className="text-sm font-medium leading-relaxed text-slate-500">
        Cadastre-se para salvar sua coleção e continuar de onde parou.
      </p>
    </div>
  );
}