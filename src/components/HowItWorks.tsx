import { useEffect, useState } from "react";

const steps = [
  "Marque as figurinhas que você já tem.",
  "Veja o que falta para completar.",
  "Controle suas repetidas.",
  "Compartilhe seu link de trocas.",
  "Compare com amigos.",
];

export function HowItWorks() {
  const [isOpen, setIsOpen] = useState(() =>
    window.matchMedia("(min-width: 901px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 901px)");
    const handleChange = () => {
      setIsOpen(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <section className="how-it-works" aria-labelledby="how-it-works-title">
      <details
        className="how-it-works__dropdown"
        open={isOpen}
        onToggle={(event) => {
          setIsOpen(event.currentTarget.open);
        }}
      >
        <summary className="how-it-works__summary">
          <span className="section-kicker" id="how-it-works-title">
            Como funciona
          </span>
          <span className="how-it-works__chevron" aria-hidden="true" />
        </summary>

        <ol className="how-it-works__steps">
          {steps.map((step, index) => (
            <li key={step}>
              <span aria-hidden="true">{index + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}
