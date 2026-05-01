import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ToastContext } from '../contexts/ToastContext';

type ToastVariant = "success" | "error" | "info";

type Toast = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(toast: ToastInput) {
    const id = Date.now();

    setToasts((currentToasts) => [
      ...currentToasts,
      {
        id,
        title: toast.title,
        description: toast.description,
        variant: toast.variant ?? "info",
      },
    ]);

    window.setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((currentToast) => currentToast.id !== id)
      );
    }, 4200);
  }

  const value = useMemo(
    () => ({
      showToast,
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="toast-viewport"
        aria-live="polite"
        aria-label="Notificações"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={["toast", `toast--${toast.variant}`].join(" ")}
          >
            <strong>{toast.title}</strong>

            {toast.description && <span>{toast.description}</span>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
