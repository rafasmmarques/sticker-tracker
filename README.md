# Sticker Tracker

[![React](https://img.shields.io/badge/React-19.2.5-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0.10-646CFF?logo=vite)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-%5E6.0.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.105.1-3FCF8E?logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

> Track your sticker collection. Mobile-first. Offline-ready. Cloud sync optional.

Sticker Tracker is a mobile-first React app for tracking sticker album collections. It works offline using local storage and optionally syncs to the cloud via Supabase.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure your Supabase credentials in .env.local
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_anon_key

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

## Features

- **Mark stickers** you own with a single tap
- **Track missing stickers** - see what's missing from your collection
- **Track repeated stickers** - count duplicates
- **Copy/share missing sticker lists** - export for trading
- **Offline-first** - works without internet using local storage
- **Cloud sync** - optional Supabase authentication
- **Mobile-first design** - optimized for one-handed use

## Prerequisites

- Node.js 18+
- npm 9+
- [Supabase account](https://supabase.com) (cloud) OR Docker (local)

## Database Setup

### Option 1: Supabase Cloud (Recommended)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the migration file:

```bash
# In supabase/migrations/20260501000000_create_initial_schema.sql
```

4. Run the seed file:

```bash
# In supabase/seed.sql
```

5. Go to Project Settings > API
6. Copy your `Project URL` and `anon public` key
7. Add them to your `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Option 2: Supabase Local (Docker)

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
npx supabase start

# The local URL will be shown in the output
# Typically: http://127.0.0.1:54321

# Run migrations
npx supabase db push

# Run seed
npx supabase db execute --file=supabase/seed.sql

# Get local credentials
npx supabase status
```

Add the local credentials to `.env.local`:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
```

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profile linked to `auth.users` |
| `albums` | Album metadata (slug, name, year, total_stickers) |
| `teams` | Teams/sections with colors and group info |
| `sticker_types` | Type classifications (player, team_crest, special, etc.) |
| `sticker_groups` | Groups per album (Intro, Museum, Team sections) |
| `stickers` | Sticker catalog (code, number, player info) |
| `user_stickers` | User quantities (user_id, sticker_id, quantity) |

### Row Level Security (RLS)

All tables have RLS enabled:

- `albums`, `teams`, `sticker_types`, `sticker_groups`, `stickers` - public read
- `profiles` - owner read/write
- `user_stickers` - owner full access

## API Reference

### Services

#### authService.ts

```typescript
// Sign in with email and password
signInWithEmail(email: string, password: string): Promise<void>

// Sign up new user
signUpWithEmail(email: string, password: string): Promise<void>

// Sign out current user
signOut(): Promise<void>

// Ensure user profile exists
ensureUserProfile(user: User): Promise<void>
```

#### stickerCatalogService.ts

```typescript
// Fetch complete sticker catalog from database
fetchStickerCatalog(): Promise<Sticker[]>
```

#### stickerCollectionService.ts

```typescript
// Fetch user's collection from cloud
fetchUserStickerCollection(userId: string): Promise<StickerCollection>

// Sync collection to cloud (upsert + delete obsolete)
syncUserStickerCollection(userId: string, collection: StickerCollection): Promise<void>
```

### Hooks

#### useAuth()

```typescript
const { user, isAuthLoading, isAuthenticated } = useAuth()

// user: Current user or null
// isAuthLoading: Loading state during initial session check
// isAuthenticated: Boolean indicating login status
```

#### useStickerCatalog()

```typescript
const { stickers, isLoading, error } = useStickerCatalog()

// stickers: Array of Sticker objects
// isLoading: Loading state
// error: Error message if cloud fetch failed
//
// Falls back to local data/stickers.ts if offline
```

#### useStickerCollection(userId?)

```typescript
const {
  collection,
  isSyncing,
  syncError,
  saveCollection,
  increaseStickerQuantity,
  decreaseStickerQuantity
} = useStickerCollection(userId)

// collection: StickerCollection (Record<stickerId, quantity>)
// isSyncing: Sync in progress
// syncError: Error message if sync failed
// saveCollection(): Force save to local + cloud
// increaseStickerQuantity(stickerId): Add +1 to quantity
// decreaseStickerQuantity(stickerId): Remove -1 (or delete if 1)
```

### Types

#### Sticker

```typescript
type Sticker = {
  id: number;
  code: string;
  number: number;
  albumCode: string;
  groupCode: string;
  numberInGroup: number;
  displayCode: string;
  playerName?: string | null;
  playerPosition?: string | null;
  isSpecial: boolean;
  specialFinish?: string | null;
  section?: string | null;
  pageNumber?: number | null;
  displayOrder: number;
  team?: StickerTeam | null;
  group?: StickerGroup | null;
  type?: StickerType | null;
}
```

#### StickerTeam

```typescript
type StickerTeam = {
  id: number;
  slug: string;
  name: string;
  countryCode?: string | null;
  fifaCode?: string | null;
  albumCode?: string | null;
  groupLetter?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
}
```

#### StickerGroup

```typescript
type StickerGroup = {
  id: number;
  code: string;
  name: string;
  type: 'intro' | 'team';
  displayOrder: number;
}
```

#### StickerType

```typescript
type StickerType = {
  id: number;
  slug: string;
  name: string;
  isSpecial: boolean;
}
```

#### StickerCollection

```typescript
// Map of sticker ID to quantity
type StickerCollection = Record<number, number>

// Example: { 1: 2, 5: 1, 23: 3 }
// Means: sticker #1 x2, sticker #5 x1, sticker #23 x3
```

## Project Structure

```
src/
├── components/         # React UI components
│   ├── AppHero.tsx
│   ├── AppNavbar.tsx
│   ├── BackToTopButton.tsx
│   ├── BrandMark.tsx
│   ├── CollectionStats.tsx
│   ├── CollectionToolbar.tsx
│   ├── StickerCard.tsx
│   ├── StickerGrid.tsx
│   └── ToastProvider.tsx
│
├── constants/          # App constants
│   └── collection.ts
│
├── data/               # Fallback data
│   └── stickers.ts
│
├── hooks/              # React hooks
│   ├── useAuth.ts
│   ├── useStickerCatalog.ts
│   ├── useStickerCollection.ts
│   └── useToast.ts
│
├── lib/                # Supabase client
│   └── supabase.ts
│
├── services/           # Business logic
│   ├── authService.ts
│   ├── stickerCatalogService.ts
│   └── stickerCollectionService.ts
│
├── styles/             # CSS modules
│   ├── auth-dropdown.css
│   ├── back-to-top.css
│   ├── brand-mark.css
│   ├── collection-stats.css
│   ├── collection-toolbar.css
│   ├── hero.css
│   ├── layout.css
│   ├── navbar.css
│   ├── responsive.css
│   ├── stickers.css
│   ├── toast.css
│   └── tokens.css
│
├── types/              # TypeScript types
│   └── sticker.ts
│
├── utils/              # Pure utility functions
│   └── collection.ts
│
├── App.tsx
├── index.css
└── main.tsx

supabase/
├── migrations/          # Database migrations
│   └── 20260501000000_create_initial_schema.sql
└── seed.sql            # Initial data seed
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Contributing

This project is maintained by the owner. Contributions are not currently accepting pull requests, but feel free to fork and adapt for your own use.

## License

MIT License - see [LICENSE](./LICENSE) for details.