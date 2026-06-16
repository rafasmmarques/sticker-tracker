import { Link } from "react-router";
import { KofiButton } from "./KofiButton";

type AppFooterProps = {
  developerName?: string;
};

const faqItems = [
  {
    question: "O app é gratuito?",
    answer:
      "Sim. Sem anúncios, sem microtransações, sem assinaturas. O app foi feito pela comunidade para a comunidade.",
  },
  {
    question: "Preciso criar conta?",
    answer: "Não para começar. A conta é útil para sincronizar sua coleção e criar link público de trocas.",
  },
  {
    question: "Funciona no celular?",
    answer:
      "Sim. O Minha Coleção 2026 foi pensado para uso rápido no celular, inclusive com scanner de figurinhas pela câmera.",
  },
  {
    question: "Como funciona o scanner?",
    answer:
      "Abra a opção Escanear, permita o acesso à câmera e posicione o código da figurinha no guia. O app identifica o código e atualiza sua coleção conforme o modo escolhido.",
  },
  {
    question: "Posso compartilhar minha lista?",
    answer: "Sim. Você pode copiar suas faltantes, repetidas e compartilhar seu link de trocas.",
  },
  {
    question: "Como funciona a área de trocas?",
    answer: "Você ativa um link público, mostra faltantes e repetidas, e compara com a coleção de amigos.",
  },
];

export function AppFooter({ developerName }: AppFooterProps) {
  return (
    <footer className="app-footer">
      <div className="app-footer__content">
        <section className="app-footer__faq" aria-labelledby="footer-faq-title">
          <span className="section-kicker">FAQ</span>
          <h2 id="footer-faq-title">Dúvidas rápidas</h2>

          <div className="app-footer__faq-grid">
            {faqItems.map((item) => (
              <details key={item.question} className="app-footer__faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {developerName ? (
          <>
            <nav className="app-footer__links" aria-label="Links do rodapé">
              <Link to="/privacidade">Privacidade</Link>
            </nav>
            <p>
              Desenvolvido por{" "}
              <a
                href="https://github.com/rafasmmarques/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>{developerName}</strong>
              </a>
            </p>
            <KofiButton />
          </>
        ) : (
          <p>Feito com React + TypeScript</p>
        )}
      </div>
    </footer>
  );
}
