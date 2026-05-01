import { createContext } from "react";

type ToastVariant = "success" | "error" | "info";

type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

export type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);