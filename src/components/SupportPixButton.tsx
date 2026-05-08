import { SUPPORT_MESSAGE } from "../constants/support";
import { showToast } from "../utils/toast";

type SupportPixButtonProps = {
  pixKey: string;
  className?: string;
};

export function SupportPixButton({
  pixKey,
  className = "app-footer__pix",
}: SupportPixButtonProps) {
  async function handleCopyPix() {
    await navigator.clipboard.writeText(pixKey);
    showToast({
      title: "Chave pix copiada.",
      description: "Agora é só colar no app do seu banco.",
      variant: "success",
    });
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleCopyPix}
      aria-label="Copiar chave pix"
    >
      {SUPPORT_MESSAGE}
      <br />
      É só clicar aqui!
    </button>
  );
}
