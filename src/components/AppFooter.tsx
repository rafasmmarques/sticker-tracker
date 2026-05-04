import { useToast } from "../hooks/useToast";

type AppFooterProps = {
  developerName?: string;
  pixKey?: string;
};

export function AppFooter({ developerName, pixKey }: AppFooterProps) {
  const { showToast } = useToast();

  async function handleCopyPix() {
    if (!pixKey) return;
    await navigator.clipboard.writeText(pixKey);
    showToast({
      title: "Chave pix copiada.",
      description: "Agora é só colar no app do seu banco.",
      variant: "success",
    });
  }

  return (
    <footer className="app-footer">
      <div className="app-footer__content">
        {developerName ? (
          <>
            <p>
              Desenvolvido por <strong>{developerName}</strong>
            </p>
            {pixKey && (
              <button
                type="button"
                className="app-footer__pix"
                onClick={handleCopyPix}
                aria-label="Copiar chave pix"
              >
                Gostou do projeto? Que tal me ajudar num cafézinho? ☕
                <br />
                É só clicar aqui!
              </button>
            )}
          </>
        ) : (
          <p>Feito com React + TypeScript</p>
        )}
      </div>
    </footer>
  );
}