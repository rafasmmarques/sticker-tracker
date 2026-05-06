# AGENTS.md

## Project Overview

Sticker Tracker is a mobile-first React + Vite + TypeScript app for tracking a sticker collection.

The app allows users to:

- mark stickers they own;
- track missing stickers;
- track repeated stickers;
- copy/share missing sticker lists;
- save locally in the browser;
- optionally authenticate with Supabase to sync the collection in the cloud.

The project is intended to be clean, portfolio-ready, and easy to evolve.

## Main Goals

When working on this project, prioritize:

1. Mobile-first usability.
2. Clean React architecture.
3. Clear component boundaries.
4. Simple and maintainable CSS.
5. Safe Supabase usage.
6. Good Git hygiene.
7. Accessibility and responsive behavior.
8. No unnecessary complexity.

This is a simple SaaS, but it should not be implemented carelessly.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS v4
- Supabase
- Local storage for offline/local-first collection state

Use `npm` as the package manager unless the repository is explicitly migrated to another tool.

## Important Commands

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Run lint only if the script exists in `package.json`:

```bash
npm run lint
```

Before considering a task complete, at minimum run:

```bash
npm run build
```

If lint is available, run it too.

## Repository Structure

Expected structure:

```txt
src/
  components/
    AppHero.tsx
    AppNavbar.tsx
    BackToTopButton.tsx
    BrandMark.tsx
    CollectionStats.tsx
    CollectionToolbar.tsx
    StickerCard.tsx
    StickerGrid.tsx
    ToastProvider.tsx

  constants/
    collection.ts

  data/
    stickers.ts

  hooks/
    useAuth.ts
    useStickerCatalog.ts
    useStickerCollection.ts

  lib/
    supabase.ts

  services/
    authService.ts
    stickerCatalogService.ts
    stickerCollectionService.ts

  styles/
    auth-dropdown.css
    back-to-top.css
    brand-mark.css
    collection-stats.css
    collection-toolbar.css
    hero.css
    layout.css
    navbar.css
    responsive.css
    stickers.css
    toast.css
    tokens.css

  types/
    sticker.ts

  utils/
    collection.ts

  App.tsx
  index.css
  main.tsx
```

Keep this separation unless there is a strong reason to change it.

## Coding Standards

Use TypeScript strictly and prefer explicit types for public functions, services, hooks, and component props.

Use English for code internals:

- variables;
- functions;
- file names;
- type names;
- service names.

Use Portuguese for user-facing UI text unless the product direction changes.

Do not add comments to code unless the logic is genuinely non-obvious or the user explicitly asks for comments.

Prefer small, focused functions.

Avoid large components. If a component starts handling too many responsibilities, split it into:

- a presentational component;
- a hook;
- a service;
- a utility function.

Avoid deeply nested JSX when possible.

## React Guidelines

Keep business logic out of visual components.

Use this separation:

- `components/`: UI and interaction composition.
- `hooks/`: stateful behavior and lifecycle logic.
- `services/`: Supabase/API integration.
- `utils/`: pure functions.
- `types/`: shared TypeScript types.
- `constants/`: app constants.

Do not call Supabase directly inside presentational components. Use services or hooks.

Prefer derived values through `useMemo` when the calculation depends on state and may affect rendering.

Avoid premature optimization, but keep mobile performance in mind because the collection can render many cards.

## UI/UX Guidelines

Always think mobile-first.

The app will often be used in real-world exchange situations, such as streets, malls, events, or sticker trading points. UI decisions should assume:

- one-handed usage;
- small screens;
- fast interactions;
- unstable internet;
- users quickly searching numbers;
- users marking stickers during conversations.

Do not block the main collection experience with authentication UI.

Authentication should live in the hamburger menu/dropdown.

The navbar should not be sticky unless there is a strong UX reason. Use a “back to top” button for long-scroll recovery.

Prefer toast feedback for:

- login success;
- account creation;
- collection saved;
- copy/share actions;
- sync errors.

Do not show a toast every time a sticker quantity changes.

Destructive actions such as clearing a collection should not be primary actions in the hero.

## CSS Guidelines

The project uses Tailwind CSS v4. Use Tailwind utility classes in components first.

Only create custom CSS when Tailwind cannot achieve the desired effect.

CSS is split by responsibility in `src/styles`.

`src/index.css` should only import style modules.

Use:

- `tokens.css` for global variables, reset, design tokens;
- `layout.css` for global layout helpers;
- one CSS file per major component/area;
- `responsive.css` for shared responsive overrides.

Prefer existing CSS variables before adding new hardcoded colors.

When adding a new color, add it to `tokens.css`.

Keep selectors readable and scoped by component class names.

Use BEM-like class naming where practical:

```css
.component .component__element .component--variant;
```

Respect accessibility preferences:

```css
@media (prefers-reduced-motion: reduce) {
  /* disable non-essential animations */
}
```

Animations should clarify state changes, not distract.

For login/register transitions, prefer clear directional animations using `transform` and `transition`.

## Supabase Guidelines

Never expose `service_role` keys in the frontend.

Only use public anon/publishable keys in Vite env variables.

Frontend environment variables must use the `VITE_` prefix.

Expected local env file:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Never commit `.env.local`.

All user-owned tables must use Row Level Security.

The app currently uses:

- `profiles`
- `user_stickers`
- `teams`
- `sticker_types`
- `stickers`

The `stickers` table should become the source of truth for the catalog.

The frontend fallback catalog in `src/data/stickers.ts` should exist only as a fallback for offline/error scenarios.

When changing the database schema:

1. explain the reason;
2. provide the SQL migration/update;
3. mention whether existing data is affected;
4. update the related TypeScript types;
5. update the Supabase service layer;
6. keep RLS policies in mind.

Do not make schema changes casually.

## Database Modeling Guidelines

Treat the sticker catalog as structured data.

A sticker can have:

- number;
- code;
- player name;
- player position;
- team/selection;
- sticker type;
- special status;
- special finish;
- section;
- page/order metadata.

Keep user collection state separate from sticker catalog data.

`user_stickers` should only represent the user's quantity for each sticker.

Do not duplicate player/team/type metadata inside `user_stickers`.

Prefer normalized tables for:

- teams;
- sticker types;
- stickers;
- user sticker quantities.

## Auth Guidelines

The app supports local-first usage. Users should be able to use the app without logging in.

When logged out:

- collection changes are saved locally.

When logged in:

- collection should sync to Supabase;
- local collection and cloud collection should be merged safely;
- sync errors should not destroy local data.

Account creation should clearly tell the user to confirm their email and check spam.

If a login fails because the email is not confirmed, show a friendly message.

## Local-First Collection Rules

Never lose local collection data.

When syncing:

- fetch remote collection;
- merge local and remote;
- prefer the highest quantity for each sticker;
- sync merged result back to Supabase.

Saving locally should always work even if cloud sync fails.

Cloud sync failure should show a toast, not break the app.

## Git Workflow

Before making changes:

1. inspect relevant files;
2. understand current behavior;
3. make the smallest coherent change;
4. keep unrelated refactors out of the same change.

Use feature branches:

```bash
git checkout -b feature/short-description
```

Before committing:

```bash
git status
npm run build
```

If lint exists:

```bash
npm run lint
```

Commit messages should be concise and descriptive:

```txt
feat: add mobile auth dropdown
fix: prevent auth loading from blocking menu
refactor: split global styles by feature
chore: update agents instructions
```

Do not force push unless the user explicitly requests it.

Do not rewrite Git history unless instructed.

## Task Handling Rules

When asked to change UI:

- think like a senior UI/UX developer;
- prioritize mobile first;
- explain tradeoffs briefly;
- avoid clutter;
- keep primary actions obvious.

When asked to change React logic:

- keep state predictable;
- avoid duplicated state;
- keep side effects in hooks;
- keep Supabase calls in services.

When asked to change CSS:

- ALWAYS prioritize Tailwind utility classes before creating custom CSS;
- Only create custom CSS when Tailwind cannot achieve the desired effect;
- update the correct file in `src/styles`;
- avoid dumping everything into `index.css`;
- check mobile breakpoints.

Examples of when to use Tailwind (preferred):
- flexbox: `flex`, `flex-col`, `items-center`, `justify-between`, `gap-4`
- grid: `grid`, `grid-cols-2`, `gap-4`
- spacing: `p-4`, `m-2`, `mt-4`, `gap-2`
- sizing: `w-full`, `h-12`, `min-w-40`
- colors: `bg-white`, `text-navy`, `border-black/10`
- typography: `text-sm`, `font-bold`, `text-center`
- border-radius: `rounded-full`, `rounded-xl`
- shadows: `shadow-lg`, `shadow-xl`
- transitions: `transition-all`, `duration-200`
- responsive: `md:flex`, `lg:grid-cols-3`

Examples of when custom CSS is needed:
- complex animations keyframes
- very specific pseudo-elements
- CSS-only solutions not available in Tailwind

When asked to change database:

- think like a systems architect;
- protect user data;
- keep schema normalized;
- update RLS and grants if needed;
- update frontend types and services.

When asked to debug:

- ask for relevant files if missing;
- inspect likely causes before proposing code;
- do not guess blindly;
- provide precise file-level changes.

## Accessibility Guidelines

Use semantic HTML where possible.

Buttons must be real `<button>` elements.

Forms must submit through `<form>`.

Use meaningful `aria-label` for icon-only buttons.

Avoid making hidden inactive form panes focusable.

Use `aria-hidden` and `tabIndex={-1}` when appropriate in animated auth panes.

Keep contrast strong enough for outdoor mobile use.

## Security Guidelines

Never commit:

- `.env.local`;
- Supabase service role keys;
- private credentials;
- API secrets.

Do not add official FIFA/Panini copyrighted assets unless the user explicitly accepts the risk.

Prefer custom or user-provided brand assets for portfolio usage.

## Definition of Done

A task is complete when:

- the app still builds;
- the change works on mobile layout;
- no obvious TypeScript errors remain;
- code is placed in the correct file/layer;
- user-facing text is clear;
- auth/database changes do not risk data loss;
- CSS remains componentized;
- the change is easy to review in Git.

## Current Product Direction

The product should feel like a lightweight, polished mobile SaaS for sticker collectors.

The experience should be:

- fast;
- friendly;
- visual;
- reliable;
- easy to use in public sticker exchange situations.

Do not over-engineer the MVP, but keep the architecture clean enough for portfolio review.
