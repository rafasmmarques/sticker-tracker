type AuthModeToggleProps = {
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
};

export function AuthModeToggle({ mode, onModeChange }: AuthModeToggleProps) {
  return (
    <div className="relative grid grid-cols-2 rounded-full bg-[rgba(23,27,95,0.08)] p-1">
      <span
        className={[
          "absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm transition-transform duration-300",
          mode === "register" ? "translate-x-full" : "translate-x-0",
        ].join(" ")}
      />
      <button
        type="button"
        className={[
          "relative z-10 h-9 rounded-full text-sm font-black transition-colors",
          mode === "login" ? "text-[var(--color-navy)]" : "text-slate-500",
        ].join(" ")}
        aria-pressed={mode === "login"}
        onClick={() => onModeChange("login")}
      >
        Entrar
      </button>
      <button
        type="button"
        className={[
          "relative z-10 h-9 rounded-full text-sm font-black transition-colors",
          mode === "register" ? "text-[var(--color-navy)]" : "text-slate-500",
        ].join(" ")}
        aria-pressed={mode === "register"}
        onClick={() => onModeChange("register")}
      >
        Criar conta
      </button>
    </div>
  );
}