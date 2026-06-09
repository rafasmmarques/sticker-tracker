# Sticker Tracker

[![React](https://img.shields.io/badge/React-19.2.5-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0.10-646CFF?logo=vite)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.105.1-3FCF8E?logo=supabase)](https://supabase.com)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare)](https://workers.cloudflare.com/)

Sticker Tracker e um app mobile-first para acompanhar colecoes de figurinhas. Ele funciona localmente no navegador, permite sincronizacao opcional com Supabase e oferece links publicos para facilitar trocas entre colecionadores.

## Principais Recursos

- Marcar figurinhas que voce tem, incluindo repetidas.
- Escanear o codigo da figurinha com a camera do celular.
- Ver progresso, faltantes, repetidas e percentual da colecao.
- Buscar por codigo, selecao ou jogador.
- Filtrar por faltantes, especiais e selecoes.
- Alternar entre visualizacao compacta em lista e cards.
- Copiar lista de faltantes para enviar no WhatsApp ou outros apps.
- Importar uma lista de faltantes para preencher a colecao rapidamente.
- Salvar primeiro no navegador com `localStorage`.
- Entrar com e-mail e senha para sincronizar com Supabase.
- Mesclar colecao local e remota preservando a maior quantidade por figurinha.
- Criar link publico de trocas em `/trocas/:username`.
- Comparar colecoes e gerar sugestao de troca.
- Confirmar uma troca para atualizar a colecao local.
- Usar input manual como fallback quando a camera nao estiver disponivel.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Supabase
- Supabase Edge Functions
- Gemini API
- CSS organizado por responsabilidade em `src/styles`
- Wrangler/Cloudflare Workers para preview e deploy

## Como Rodar

Requisitos:

- Node.js 18 ou superior
- npm
- Uma instancia Supabase, caso queira usar catalogo online, login e sincronizacao
- Uma chave Gemini API, caso queira usar o scanner por camera

Instale as dependencias:

```bash
npm install
```

Crie o arquivo local de ambiente:

```bash
cp .env.example .env.local
```

Configure as variaveis:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra `http://localhost:5173`.

Sem Supabase configurado, o app ainda consegue usar o catalogo fallback em `src/data/stickers.ts` e salvar a colecao no navegador.

Para usar a camera em desenvolvimento no celular, o app precisa rodar em uma origem segura. Em producao, HTTPS ja atende esse requisito. Em testes locais usando IP da rede, pode ser necessario configurar o navegador para tratar a origem local como segura.

## Scripts

| Comando | Descricao |
| --- | --- |
| `npm run dev` | Inicia o Vite em modo desenvolvimento |
| `npm run build` | Executa TypeScript e gera o bundle de producao |
| `npm run lint` | Executa ESLint |
| `npm run preview` | Gera o build e abre preview com Wrangler |
| `npm run deploy` | Gera o build e publica com Wrangler |

## Supabase

O projeto tem dois caminhos de banco:

- `supabase/setup`: scripts separados e consolidados para criar um banco novo do zero.
- `supabase/migrations`: historico incremental usado por bancos que ja existem.
- `supabase/seed.sql`: dados iniciais do catalogo, executado depois do schema.

Para um projeto Supabase novo:

1. Crie o projeto no Supabase.
2. Rode os arquivos de `supabase/setup` em ordem, de `01_extensions_and_functions.sql` ate `10_grants.sql`.
3. Se estiver usando `psql` ou Supabase CLI, voce pode usar `supabase/setup/00_run_all.sql` como runner.
4. Rode `supabase/seed.sql`.
5. Copie a URL do projeto e a chave anon para `.env.local`.

Para um banco que ja existe, nao use `supabase/setup`. Aplique apenas as migrations pendentes em `supabase/migrations`.

### Edge Function do scanner

O scanner usa a Edge Function `analyze-sticker`:

```txt
supabase/functions/analyze-sticker/index.ts
```

Ela recebe a imagem capturada no frontend, chama a Gemini API no ambiente seguro do Supabase e retorna o codigo identificado. A chave da Gemini nao deve ser exposta no frontend.

Configure os secrets no Supabase:

```bash
npx supabase secrets set GEMINI_API_KEY="sua-chave-gemini"
```

O modelo padrao e `gemini-3.5-flash`. Se quiser sobrescrever:

```bash
npx supabase secrets set GEMINI_MODEL="gemini-3.5-flash"
```

Publique a funcao:

```bash
npx supabase functions deploy analyze-sticker
```

O seed inicial cria:

- album `world-cup-2026`;
- tipos de figurinhas, incluindo `partner_extra`;
- grupos `FWC`, `PAN`, `CC` e grupos das selecoes;
- catalogo normalizado, incluindo Coca-Cola `981..994` e Panini `995`.

Tabelas principais:

| Tabela | Uso |
| --- | --- |
| `profiles` | Perfil do usuario, username e status do link de trocas |
| `albums` | Metadados do album |
| `teams` | Selecoes/times, grupo e cores |
| `sticker_types` | Tipos de figurinhas |
| `sticker_groups` | Agrupamentos do album |
| `stickers` | Catalogo normalizado de figurinhas |
| `user_stickers` | Quantidade de cada figurinha por usuario |

Todas as tabelas usam Row Level Security. O catalogo e publico para leitura. Colecoes so podem ser alteradas pelo proprio usuario. Colecoes publicas para troca sao expostas apenas quando o perfil tem link ativo e username configurado.

## Arquitetura

```txt
src/
  components/              Componentes de UI
    trade/                 Componentes de comparacao e confirmacao de trocas
  constants/               Constantes da aplicacao
  contexts/                Contextos React
  data/                    Catalogo fallback local
  hooks/                   Estado, ciclo de vida e integracoes
  lib/                     Clientes externos
  pages/                   Paginas roteadas
  services/                Supabase e regras de persistencia remota
  styles/                  CSS por area/responsabilidade
  types/                   Tipos compartilhados
  utils/                   Funcoes puras de colecao e troca
supabase/
  functions/               Edge Functions usadas pelo app
```

Separacao principal:

- Componentes nao chamam Supabase diretamente.
- Hooks coordenam estado local, efeitos e sincronizacao.
- Services concentram acesso ao Supabase.
- Utils mantem calculos puros, como resumo da colecao e sugestao de troca.
- `src/index.css` apenas importa os arquivos de estilo.

## Fluxo Local-First

A colecao sempre e salva em `localStorage`. Quando o usuario entra:

1. A colecao local e carregada.
2. A colecao remota e buscada no Supabase.
3. As duas sao mescladas usando a maior quantidade de cada figurinha.
4. O resultado mesclado e sincronizado de volta para a nuvem.

Se a sincronizacao falhar, a colecao local continua preservada e o app mostra feedback por toast.

## Links de Troca

Usuarios autenticados podem configurar um username e ativar um link publico em:

```txt
/trocas/:username
```

A pagina publica mostra progresso, faltantes e repetidas da colecao compartilhada. Quando o visitante tambem tem uma colecao carregada, o app pode comparar as duas colecoes e sugerir uma troca com base nas repetidas e faltantes de cada pessoa.

## Scanner de Figurinhas

A rota `/escanear` abre a camera do celular e captura um frame do codigo da figurinha. A imagem e enviada para a Edge Function `analyze-sticker`, que chama a Gemini API e retorna um codigo como `BRA 10` ou `FWC 3`.

O frontend valida o codigo contra o catalogo carregado antes de alterar a colecao. No modo adicionar, a quantidade da figurinha aumenta. No modo dar baixa em repetida, a quantidade so diminui quando o usuario tem mais de uma unidade.

O scanner exige permissao de camera do navegador. Se a camera nao estiver disponivel, o usuario ainda pode digitar o codigo manualmente.

## Deploy

O projeto inclui `wrangler.jsonc` configurado com `not_found_handling: "single-page-application"`, necessario para rotas como `/trocas/:username` funcionarem em producao.

Para publicar:

```bash
npm run deploy
```

Para testar o build localmente com Wrangler:

```bash
npm run preview
```

## Observacoes

- `.env.local` nao deve ser versionado.
- Use apenas chaves publicas anon/publishable do Supabase no frontend.
- `GEMINI_API_KEY` deve ficar apenas nos secrets da Supabase Edge Function.
- O catalogo em `src/data/stickers.ts` e fallback para erro/offline; a fonte principal deve ser a tabela `stickers`.
- O README nao declara licenca porque nao ha arquivo de licenca no repositorio atualmente.
