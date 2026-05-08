import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faXmark } from "@fortawesome/free-solid-svg-icons";
import { SUPPORT_PIX_KEY } from "../constants/support";
import { SupportPixButton } from "./SupportPixButton";

type AlbumCompletedDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AlbumCompletedDialog({
  isOpen,
  onClose,
}: AlbumCompletedDialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="album-completed-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="album-completed-title"
      onClick={onClose}
    >
      <div
        className="album-completed-dialog__panel"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="album-completed-dialog__close"
          onClick={onClose}
          aria-label="Fechar mensagem de álbum completo"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="album-completed-dialog__icon" aria-hidden="true">
          <FontAwesomeIcon icon={faTrophy} />
        </div>

        <span className="album-completed-dialog__kicker">
          Álbum completo
        </span>
        <h2 id="album-completed-title">Parabéns, coleção finalizada!</h2>
        <p>
          Você marcou todas as figurinhas do álbum. Agora é só comemorar e
          mostrar essa conquista para a galera.
        </p>
        <SupportPixButton
          pixKey={SUPPORT_PIX_KEY}
          className="app-footer__pix album-completed-dialog__support-button"
        />

        <div className="album-completed-dialog__actions">
          <button
            type="button"
            className="album-completed-dialog__secondary"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
