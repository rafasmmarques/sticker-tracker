import { Link } from "react-router";
import { AppFooter } from "../components/AppFooter";
import { usePageSeo } from "../hooks/usePageSeo";
import { DEVELOPER_NAME } from "../constants/support";
import "../styles/privacy-page.css";

const privacySections = [
  {
    title: "Quem é responsável pelo app",
    content:
      "O responsável por esta versão do Minha Coleção 2026 é Rafael Marques. Para assuntos de privacidade, solicitações sobre seus dados ou pedidos de exclusão, use o canal de contato indicado no rodapé do site.",
  },
  {
    title: "Dados que você informa",
    content:
      "Você pode usar parte do app sem criar conta. Ao criar uma conta, usamos dados como e-mail e credenciais de acesso para autenticação. O app também pode usar um nome de usuário para gerar seu link público de trocas e um nome de exibição para identificar sua conta dentro das funcionalidades do app.",
  },
  {
    title: "Coleção e progresso",
    content:
      "O app salva informações sobre sua coleção, como figurinhas marcadas, faltantes, repetidas, estatísticas e data da última sincronização. Sem conta, esses dados ficam salvos apenas neste navegador. Com conta, eles também podem ser sincronizados para permitir acesso em outros dispositivos.",
  },
  {
    title: "Link público de trocas",
    content:
      "Quando você ativa o link público de trocas, outras pessoas com acesso ao link podem visualizar informações como seu nome de usuário, resumo da coleção e listas de figurinhas faltantes e repetidas. Você pode desativar esse link quando quiser para interromper a publicação dessas informações.",
  },
  {
    title: "Scanner de figurinhas",
    content:
      "A câmera só é aberta com sua permissão pelo navegador. O vídeo da câmera não é salvo pelo app. Ao usar o scanner, uma imagem da figurinha pode ser enviada para um serviço de análise de imagem com o objetivo exclusivo de tentar identificar o código impresso na figurinha. Evite enquadrar pessoas, documentos, telas ou objetos pessoais ao usar essa funcionalidade.",
  },
  {
    title: "Compartilhamento externo",
    content:
      "Algumas ações, como copiar listas, compartilhar links no WhatsApp ou fazer uma contribuição voluntária, são iniciadas por você. Ao abrir serviços externos, o tratamento de dados passa a seguir também as regras de privacidade desses serviços.",
  },
  {
    title: "Finalidades do tratamento",
    content:
      "Os dados são usados para autenticar sua conta, salvar e sincronizar sua coleção, gerar estatísticas, permitir comparação de trocas, operar o scanner, manter a segurança do app e entregar as funcionalidades escolhidas por você.",
  },
  {
    title: "Bases legais",
    content:
      "O tratamento dos dados ocorre principalmente para executar as funcionalidades solicitadas por você, cumprir obrigações aplicáveis, proteger a segurança do app e, quando necessário, com base no seu consentimento ou em ação afirmativa, como ativar um link público de trocas ou usar o scanner.",
  },
];

export function PrivacyPage() {
  usePageSeo({
    title: "Privacidade | Minha Coleção 2026",
    description:
      "Entenda quais dados o Minha Coleção 2026 usa, como sua coleção é salva, como funcionam os links públicos de trocas, o scanner de figurinhas e seus direitos de privacidade.",
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
          Esta página explica, de forma simples, como o Minha Coleção 2026 trata
          seus dados para ajudar você a organizar sua coleção, sincronizar seu
          progresso e comparar trocas com outras pessoas.
        </p>
      </header>

      <section className="privacy-page__notice" aria-label="Resumo importante">
        <strong>Resumo:</strong> o app não vende seus dados, não usa anúncios e
        não adiciona rastreamento publicitário próprio. Os dados são usados para
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
          <h2>Serviços de terceiros</h2>
          <p>
            O app usa fornecedores para autenticação, banco de dados,
            hospedagem, análise do scanner, infraestrutura e contribuições
            voluntárias. Esses serviços são usados apenas para operar as
            funcionalidades descritas nesta política.
          </p>
          <p>
            Atualmente, o app pode usar Supabase para autenticação, banco de
            dados e funções de backend; Google Gemini para análise de imagem no
            scanner; Cloudflare para hospedagem e infraestrutura; e Ko-fi para
            contribuições voluntárias. Alguns desses fornecedores podem
            processar dados fora do Brasil, sempre de acordo com as finalidades
            informadas aqui.
          </p>
        </section>

        <section className="privacy-page__section">
          <h2>Retenção e exclusão</h2>
          <p>
            Dados locais ficam no navegador até que você limpe os dados do site
            ou use os controles do app para limpar sua coleção. Dados
            sincronizados ficam associados à sua conta enquanto ela existir ou
            até que uma solicitação de exclusão seja processada.
          </p>
          <p>
            Algumas informações técnicas, registros de segurança ou backups
            podem permanecer por tempo limitado quando necessário para
            segurança, prevenção de abuso, cumprimento de obrigações legais ou
            funcionamento correto do serviço.
          </p>
        </section>

        <section className="privacy-page__section">
          <h2>Segurança</h2>
          <p>
            O app adota medidas técnicas e organizacionais para proteger os
            dados, como controle de acesso, restrição de permissões e uso de
            fornecedores confiáveis para autenticação e infraestrutura. Ainda
            assim, nenhum sistema é completamente livre de riscos.
          </p>
        </section>

        <section className="privacy-page__section">
          <h2>Crianças e adolescentes</h2>
          <p>
            O app não é direcionado especificamente a crianças. Caso uma criança
            ou adolescente utilize o app, recomendamos o acompanhamento de um
            responsável.
          </p>
        </section>

        <section className="privacy-page__section">
          <h2>Seus direitos pela LGPD</h2>
          <p>
            Você pode solicitar confirmação de tratamento, acesso aos seus
            dados, correção, exclusão, portabilidade, informações sobre
            compartilhamento, revogação de consentimentos aplicáveis e oposição
            a tratamentos quando cabível.
          </p>
          <p>
            As solicitações são analisadas pelo responsável do projeto e
            respondidas pelo canal de contato informado no site.
          </p>
        </section>

        <section className="privacy-page__section">
          <h2>Atualizações desta política</h2>
          <p>
            Esta política pode ser atualizada para refletir mudanças no app, em
            fornecedores utilizados ou em requisitos legais. A data da última
            atualização será sempre exibida nesta página.
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
