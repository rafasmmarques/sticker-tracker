type AuthPaneProps = {
  title: string;
  description: string;
  isActive: boolean;
  children: React.ReactNode;
};

export function AuthPane({ title, description, isActive, children }: AuthPaneProps) {
  return (
    <section className="w-1/2 shrink-0 px-0.5" aria-hidden={!isActive}>
      <div className="grid gap-3">
        <div className="grid gap-1">
          <strong className="text-base font-black text-[var(--color-ink)]">{title}</strong>
          <span className="text-sm font-medium leading-relaxed text-slate-500">{description}</span>
        </div>
        {children}
      </div>
    </section>
  );
}