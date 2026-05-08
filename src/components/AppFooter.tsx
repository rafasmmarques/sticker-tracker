import { SupportPixButton } from "./SupportPixButton";

type AppFooterProps = {
  developerName?: string;
  pixKey?: string;
};

export function AppFooter({ developerName, pixKey }: AppFooterProps) {
  return (
    <footer className="app-footer">
      <div className="app-footer__content">
        {developerName ? (
          <>
            <p>
              Desenvolvido por{" "}
              <a
                href="https://github.com/rafasmmarques/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>{developerName}</strong>
              </a>
            </p>
            {pixKey && (
              <SupportPixButton pixKey={pixKey} />
            )}
          </>
        ) : (
          <p>Feito com React + TypeScript</p>
        )}
      </div>
    </footer>
  );
}
