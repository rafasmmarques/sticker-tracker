# Sticker Tracker

[![React](https://img.shields.io/badge/React-19.2.5-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0.10-646CFF?logo=vite)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.105.1-3FCF8E?logo=supabase)](https://supabase.com)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare)](https://workers.cloudflare.com/)

Sticker Tracker e um app mobile-first para acompanhar colecoes de figurinhas. Ele funciona localmente no navegador, permite sincronizacao opcional com Supabase e oferece links publicos para facilitar trocas entre colecionadores.

## Principais Recursos

- Marcar figurinhas que voce tem, incluindo repetidas.
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

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Supabase
- CSS organizado por responsabilidade em `src/styles`
- Wrangler/Cloudflare Workers para preview e deploy

## Como Rodar

Requisitos:

- Node.js 18 ou superior
- npm
- Uma instancia Supabase, caso queira usar catalogo online, login e sincronizacao

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

## Scripts

| Comando | Descricao |
| --- | --- |
| `npm run dev` | Inicia o Vite em modo desenvolvimento |
| `npm run build` | Executa TypeScript e gera o bundle de producao |
| `npm run lint` | Executa ESLint |
| `npm run preview` | Gera o build e abre preview com Wrangler |
| `npm run deploy` | Gera o build e publica com Wrangler |

## Supabase

As migracoes ficam em `supabase/migrations` e o seed inicial em `supabase/seed.sql`.

Para um projeto Supabase novo:

1. Crie o projeto no Supabase.
2. Rode `supabase/migrations/20260501000000_create_initial_schema.sql`.
3. Rode `supabase/migrations/20260504000000_add_trade_link.sql`.
4. Rode `supabase/seed.sql`.
5. Copie a URL do projeto e a chave anon para `.env.local`.

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
- O catalogo em `src/data/stickers.ts` e fallback para erro/offline; a fonte principal deve ser a tabela `stickers`.
- O README nao declara licenca porque nao ha arquivo de licenca no repositorio atualmente.
