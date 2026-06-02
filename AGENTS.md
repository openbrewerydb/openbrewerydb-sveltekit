# AGENTS.md

## Critical Rules

- **Svelte 5 runes only**: Use `$state`, `$derived`, `$props` - never legacy `$:` or `export let`
- **Context limitation**: `setContext` must be called during component initialization, NOT in `$effect`
- **No custom CSS**: Use TailwindCSS utility classes exclusively
- **TypeScript strict**: All code must be typed, no `any` without justification
- **Package manager**: Use `npm`, not pnpm

## Non-Obvious Architecture

### External Data Source

Brewery data comes from a separate repository: https://github.com/openbrewerydb/openbrewerydb

- Data contributions go to the dataset repo, NOT this repo
- This repo is the web interface/API wrapper

### SEO Pattern

- Use `SEO` component from `src/lib/components/SEO.svelte`
- Use `SEOProvider` for nested SEO configuration
- Context merges parent/child configs via `mergeSEO()` in `src/lib/seo.ts`
- **Important**: `setContext` in SEOProvider must be called synchronously during init, not in effects

### State Management

- Stores in `src/lib/stores/` use Svelte 5 runes (e.g., `breweries.svelte.ts`)
- Prefer runes over stores for local component state
- Only use stores when state needs to be shared across unrelated components

### Type Organization

- `src/lib/types.ts`: Core types (Brewery, BreweryType, Metadata)
- `src/lib/types/`: Additional type modules (e.g., `metrics.ts`)

### Data Build Scripts

Require `GITHUB_TOKEN` environment variable:

- `npm run data:build` - builds all data
- `npm run authors:build` - GitHub authors
- `npm run changelogs:build` - changelog data
- `npm run contributors:build` - contributor data

## Environment Variables

```env
SENTRY_AUTH_TOKEN=your_sentry_token  # Optional, for error tracking
GITHUB_TOKEN=your_github_token      # Required for data build scripts
```

## Deployment

- Uses Cloudflare Pages/Workers via `@sveltejs/adapter-cloudflare`
- Config: `wrangler.toml`, `svelte.config.js`
- Auto-deploys on push to main via GitHub integration
