# Open Brewery DB

A free, open-source dataset and API for brewery, cidery, brewpub, and bottleshop information worldwide. Built with Svelte 5, SvelteKit 2, TypeScript, and TailwindCSS 4.

## 🍺 What is Open Brewery DB?

Open Brewery DB is a community-driven project that maintains a comprehensive dataset of breweries and related establishments. Our mission is to provide free, public access to brewery information for developers, data analysts, and beer enthusiasts worldwide.

### Features

- **Free API**: Access brewery data through our RESTful API
- **Search & Filter**: Find breweries by location, type, and various criteria
- **Interactive Maps**: Visualize brewery locations with geographic data
- **Community Driven**: Contribute and help maintain accurate brewery information
- **Open Source**: All data and code is freely available

## 🚀 Tech Stack

- **Framework**: Svelte 5
- **Backend**: SvelteKit 2
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Deployment**: Cloudflare Pages/Workers
- **Testing**: Playwright for E2E testing
- **Monitoring**: Sentry for error tracking
- **Data Visualization**: D3.js and Layerchart for maps

## 🛠️ Development

### Prerequisites

- Node.js (LTS version)
- npm or pnpm package manager

### Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/openbrewery/openbrewerydb-sveltekit.git
   cd openbrewerydb-sveltekit
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

4. **Optional: Open in browser**
   ```bash
   npm run dev -- --open
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript checks
- `npm run lint` - Run linting and formatting checks
- `npm run format` - Format code with Prettier
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run authors:build` - Build GitHub authors data
- `npm run changelogs:build` - Build changelog data

## 📁 Project Structure

```
src/
├── lib/                 # Shared utilities and components
│   ├── components/      # Reusable Svelte components
│   ├── data/           # Static data and generated content
│   └── types.ts        # TypeScript type definitions
├── routes/             # SvelteKit pages and API routes
├── layouts/            # Page layouts
└── styles/             # Global styles and TailwindCSS
```

## 🌐 Deployment

This project is configured to deploy on Cloudflare using the `@sveltejs/adapter-cloudflare`. The build process automatically optimizes for Cloudflare's edge network.

### Edge Caching (Cloudflare Cache Rules)

The free Workers plan allows 100k requests/day, shared across the account. Only paths listed in `worker-routes.js` invoke the Pages Function; all other routes serve static assets. The server hook in `src/hooks.server.ts` adds `s-maxage` (TTLs in `src/lib/server/cache.ts`) so the CDN can serve repeat hits without invoking the Function — but only when a zone **Cache Rule** makes these responses eligible. These rules live in the Cloudflare dashboard (zone → Caching → Cache Rules), not in this repo. Currently active:

1. **Honor origin cache headers** — `Request Method equals GET` → Eligible for cache, Edge TTL, Browser TTL
2. **Cache Pages Function HTML** — hostname `www.openbrewerydb.org` and paths matching `worker-routes.js` (`/`, `/__data.json`, `/stats*`, `/breweries*`, `/b/*`) → Eligible for cache, Edge TTL, Browser TTL

Rule 1 already covers every GET, so rule 2 is redundant unless the function paths need different TTL treatment. If either rule is removed, verify caching still works:

```bash
curl -s -o /dev/null -D - https://www.openbrewerydb.org/ | grep -i cf-cache-status
# run twice — second response should show "HIT"; "DYNAMIC" means no rule applies
```

### Environment Variables

Create a `.env` file for local development:

```env
# Sentry (optional)
SENTRY_AUTH_TOKEN=your_sentry_token

# GitHub (for build scripts)
GITHUB_TOKEN=your_github_token
```

## 📊 API Documentation

Complete API documentation is available at `/documentation` in the application or online at [openbrewerydb.org/documentation](https://openbrewerydb.org/documentation).

### API Endpoints

- `GET /breweries` - List all breweries with pagination
- `GET /breweries/{id}` - Get specific brewery details
- `GET /breweries/search` - Search breweries by query

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- How to contribute data
- Code contributions
- Bug reports and feature requests
- Development setup

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Sponsors

Open Brewery DB is grateful for the support of our sponsors, particularly [Sentry](https://sentry.io/) for providing application monitoring services.

## 🔗 Links

- [Live Site](https://openbrewerydb.org/)
- [API Documentation](https://openbrewerydb.org/documentation)
- [GitHub Repository](https://github.com/openbrewery/openbrewerydb-sveltekit)
- [Issues & Feature Requests](https://github.com/openbrewery/openbrewerydb-sveltekit/issues)
