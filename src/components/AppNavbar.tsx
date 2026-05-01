import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import {
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from "../services/authService";
import { useToast } from "../hooks/useToast";

type AppNavbarProps = {
  user: User | null;
};

type AuthMode = "login" | "register";

export function AppNavbar({ user }: AppNavbarProps) {
  const { showToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsOpen(false);
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

      setIsOpen(false);
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
      <div className="app-navbar__menu">
        <button
          className="hamburger-button"
          type="button"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((currentValue) => !currentValue)}
        >
          <span />
          <span />
          <span />
        </button>

        {isOpen && (
          <div className="auth-dropdown">
            {user ? (
              <div className="auth-dropdown__content">
                <strong>Conta conectada</strong>

                <p className="auth-dropdown__hint">
                  Sua coleção pode ser salva na nuvem e acessada em outros
                  dispositivos.
                </p>

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

                          <button
                            className="auth-dropdown__switch"
                            type="button"
                            disabled={isSubmitting}
                            tabIndex={mode === "login" ? 0 : -1}
                            onClick={() => setMode("register")}
                          >
                            Quero criar uma conta
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

                          <button
                            className="auth-dropdown__switch"
                            type="button"
                            disabled={isSubmitting}
                            tabIndex={mode === "register" ? 0 : -1}
                            onClick={() => setMode("login")}
                          >
                            Já tenho conta
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
      </div>
    </nav>
  );
}
