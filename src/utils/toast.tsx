import { toast, type ExternalToast } from "sonner";
import { faCheckCircle, faCircleExclamation, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ToastVariant = "success" | "error" | "info";

type ShowToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ShowToast = (toast: ShowToastInput) => void;

export const showToast: ShowToast = ({ title, description, variant = "info" }) => {
  const icon = {
    success: <FontAwesomeIcon icon={faCheckCircle} />,
    error: <FontAwesomeIcon icon={faCircleExclamation} />,
    info: <FontAwesomeIcon icon={faCircleInfo} />,
  }[variant];

  const isError = variant === "error";
  const textColor = isError ? "#ffffff" : "var(--color-ink)";

  const baseStyle: React.CSSProperties = {
    background: isError ? "var(--color-red)" : "rgba(255, 255, 255, 0.96)",
    color: textColor,
    borderLeft: `5px solid ${
      variant === "success"
        ? "var(--color-green)"
        : variant === "error"
        ? "var(--color-red)"
        : "var(--color-blue)"
    }`,
  };

  const options: ExternalToast = {
    description,
    icon,
    style: baseStyle,
  };

  if (variant === "success") {
    toast.success(title, { ...options, descriptionClassName: "text-white/90" });
  } else if (variant === "error") {
    toast.error(title, { ...options, descriptionClassName: "text-white" });
  } else {
    toast(title, { ...options, descriptionClassName: "text-slate-600" });
  }
};