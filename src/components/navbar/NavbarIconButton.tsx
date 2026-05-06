import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

type NavbarIconButtonProps = {
  isActive: boolean;
  activeLabel: string;
  inactiveLabel: string;
  icon: IconDefinition;
  onClick: () => void;
};

export function NavbarIconButton({
  isActive,
  activeLabel,
  inactiveLabel,
  icon,
  onClick,
}: NavbarIconButtonProps) {
  return (
    <button
      type="button"
      className={[
        "grid h-12 w-12 place-items-center rounded-full border border-black/10 shadow-lg transition-colors duration-200",
        isActive
          ? "bg-[var(--color-navy)] text-white"
          : "bg-white text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-white",
      ].join(" ")}
      aria-label={isActive ? activeLabel : inactiveLabel}
      aria-expanded={isActive}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}