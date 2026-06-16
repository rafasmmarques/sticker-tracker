import { Link } from "react-router";
import { AppFooter } from "../components/AppFooter";
import { usePageSeo } from "../hooks/usePageSeo";
import { DEVELOPER_NAME } from "../constants/support";
import "../styles/privacy-page.css";

const privacySections = [
  {
    title: "Dados que você informa",
    content:
      "Você pode usar o app sem criar conta. Ao criar uma conta, o Minha Coleção 2026 usa seu e-mail e senha para autenticação pelo Supabase. O app também pode salvar um nome de usuário para o link público de trocas e um nome de exibição derivado do seu e-mail.",
  },
  {
    title: "Coleção e progresso",
    content:
      "As quantidades de figurinhas, faltantes, repetidas e data da última sincronização são usadas para manter sua coleção atualizada. Sem conta, esses dados ficam neste navegador por localStorage. Com conta, eles também são sincronizados no Supabase para permitir uso em outros dispositivos.",
  },
  {
    title: "Link público de trocas",
    content:
      "Quando você ativa o link de trocas, seu @username, o resumo da coleção e as listas de faltantes e repetidas ficam acessíveis para quem tiver ou buscar esse link. Você pode desativar o link para interromper essa publicação.",
  },
  {
    title: "Scanner de figurinhas",
    content:
      "A câmera só é aberta com permissão do navegador. O vídeo não fica salvo pelo app. Quando você toca em escanear, um frame da câmera é enviado para a função analyze-sticker no Supabase e para o Google Gemini, somente para tentar identificar o código impresso na figurinha.",
  },
  {
    title: "Compartilhamento externo",
    content:
      "Copiar listas, copiar links, compartilhar no WhatsApp e contribuir pelo Ko-fi são ações iniciadas por você. Ao abrir outro serviço, o tratamento passa a seguir as regras desse serviço externo.",
  },
  {
    title: "Finalidades",
    content:
      "Os dados são usados para autenticar sua conta, salvar e sincronizar a coleção, gerar estatísticas, permitir comparação de trocas, operar o scanner e manter a segurança básica do app.",
  },
];

export function PrivacyPage() {
  usePageSeo({
    title: "Privacidade | Minha Coleção 2026",
    description:
      "Entenda quais dados o Minha Coleção 2026 coleta, como usa localStorage, Supabase, scanner de câmera e links públicos de trocas.",
    canonicalPath: "/privacidade",
    robots: "index, follow",
  });

  return (
    <main id="top" className="privacy-page">
      <header className="privacy-page__header">
        <Link to="/" className="privacy-page__back-link">
          Minha Coleção 2026
        </Link>
        <span className="section-kicker">Privacidade</span>
        <h1>Como seus dados são tratados</h1>
        <p>
          Esta política resume, em linguagem direta, quais dados o app usa para
          organizar sua coleção, sincronizar sua conta e compartilhar trocas.
        </p>
      </header>

      <section className="privacy-page__notice" aria-label="Resumo importante">
        <strong>Resumo:</strong> o app não usa anúncios, não vende dados e não
        adiciona rastreamento publicitário próprio. Os dados são tratados para
        entregar as funcionalidades escolhidas por você.
      </section>

      <div className="privacy-page__sections">
        {privacySections.map((section) => (
          <section key={section.title} className="privacy-page__section">
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </section>
        ))}

        <section className="privacy-page__section">
          <h2>Serviços utilizados</h2>
          <p>
            O app usa Supabase para autenticação, banco de dados, regras de
            acesso e função Edge do scanner. A função do scanner chama o Google
            Gemini para analisar a imagem capturada. A hospedagem e o deploy
            podem usar Cloudflare Workers, conforme configuração do projeto. As
            contribuições voluntárias são processadas pelo Ko-fi.
          </p>
        </section>

        <section className="privacy-page__section">
          <h2>Seus direitos pela LGPD</h2>
          <p>
            Você pode solicitar confirmação de tratamento, acesso, correção,
            exclusão, portabilidade, informações sobre compartilhamento e
            revogação de consentimentos aplicáveis. Nesta primeira versão, as
            solicitações são tratadas manualmente pelo responsável do projeto.
          </p>
        </section>

        <section className="privacy-page__section">
          <h2>Retenção e exclusão</h2>
          <p>
            Dados locais ficam no navegador até você limpar os dados do site ou
            usar os controles do app para limpar a coleção. Dados sincronizados
            ficam associados à sua conta enquanto ela existir ou até uma
            solicitação de exclusão ser processada.
          </p>
        </section>

        <section className="privacy-page__section">
          <h2>Contato</h2>
          <p>
            O responsável por esta versão do app é Rafael Marques. Para
            assuntos de privacidade, use o perfil público no GitHub indicado no
            rodapé do site.
          </p>
        </section>
      </div>

      <p className="privacy-page__updated">
        Última atualização: 16 de junho de 2026.
      </p>

      <AppFooter developerName={DEVELOPER_NAME} />
    </main>
  );
}
