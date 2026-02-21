# Contributing to Open Brewery DB

Thank you for your interest in contributing to Open Brewery DB! This guide will help you get started with contributing to our brewery dataset and codebase.

## 🤝 How to Contribute

We welcome contributions in several forms:

- **Data Contributions**: Adding new breweries or updating existing information
- **Code Contributions**: Improving the website, API, or tooling
- **Bug Reports**: Reporting issues with data or functionality
- **Feature Requests**: Suggesting new features or improvements
- **Documentation**: Improving documentation and guides

## 🍺 Data Contributions

Go to the [OBDB Dataset repo](https://github.com/openbrewerydb/openbrewerydb) to add or update breweries.

## 💻 Code Contributions

### Development Setup

1. **Fork the repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/openbrewerydb-sveltekit.git
   cd openbrewerydb-sveltekit
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development**

   ```bash
   npm run dev
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Code Style and Standards

We use the following tools and standards:

- **TypeScript**: All code should be typed
- **Svelte 5 Runes**: Use `$state`, `$props`, `$derived`, `$effect` instead of legacy reactivity
- **TailwindCSS 4**: Use utility classes for styling (no custom CSS)
- **ESLint + Prettier**: Code is automatically formatted
- **Playwright**: E2E tests for critical functionality

#### Svelte 5 Runes Examples

```svelte
<!-- ✅ Correct: Use runes -->
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(() => count * 2);

  function increment() {
    count++;
  }
</script>

<!-- ❌ Incorrect: Legacy reactivity -->
<script lang="ts">
  import { writable } from 'svelte/store';
  export let count = 0;
  $: doubled = count * 2;
</script>
```

#### TailwindCSS Usage

```svelte
<!-- ✅ Correct: Use Tailwind classes -->
<div class="bg-amber-50 p-4 rounded-lg shadow-md">
  <h2 class="text-xl font-bold text-gray-900">Brewery Name</h2>
</div>

<!-- ❌ Incorrect: Custom CSS -->
<style>
  .brewery-card {
    background-color: #fffbeb;
    padding: 1rem;
    border-radius: 0.5rem;
  }
</style>
```

### Testing

- **E2E Tests**: Use Playwright for user flow testing
- **Type Checking**: Run `npm run check` before committing
- **Linting**: Run `npm run lint` to check code quality

```bash
# Run all checks
npm run check
npm run lint
npm run test:e2e
```

### Making Changes

1. **Keep changes focused** on a single feature or bug fix
2. **Follow existing code patterns** and conventions
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Ensure all checks pass** before submitting

### Pull Request Process

1. **Update your fork** with the latest changes

   ```bash
   git remote add upstream https://github.com/openbrewery/openbrewerydb-sveltekit.git
   git pull upstream main
   ```

2. **Create a pull request**
   - Use a descriptive title
   - Describe what you changed and why
   - Link to any related issues
   - Include screenshots for UI changes

3. **Address feedback**
   - Respond to reviewer comments promptly
   - Make requested changes
   - Keep the PR updated

## 🐛 Bug Reports

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (browser, OS, etc.)
- **Screenshots** if applicable
- **API calls** or URLs involved

### Bug Report Template

```markdown
## Description

Brief description of the issue

## Steps to Reproduce

1. Go to...
2. Click on...
3. See error

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Environment

- OS: [e.g., macOS 14.0]
- Browser: [e.g., Chrome 120]
- URL: [if applicable]

## Additional Context

Any other relevant information
```

## 💡 Feature Requests

We welcome feature requests! Please:

1. **Check existing issues** first to avoid duplicates
2. **Describe the problem** you're trying to solve
3. **Explain the proposed solution**
4. **Consider alternatives** you've thought of
5. **Provide use cases** and examples

## 📝 Documentation Contributions

Help us improve documentation by:

- **Fixing typos** and grammatical errors
- **Adding examples** to API documentation
- **Improving guides** and tutorials
- **Translating content** to other languages
- **Adding screenshots** and diagrams

## 🏗️ Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable Svelte components
│   ├── data/          # Static data and generated content
│   ├── types.ts       # TypeScript type definitions
│   └── utils/         # Utility functions
├── routes/            # SvelteKit pages and API routes
│   ├── breweries/     # Brewery-related pages
│   ├── documentation/ # API documentation
│   └── api/          # API endpoints
├── layouts/           # Page layouts
└── styles/           # Global styles and TailwindCSS
```

## 🚀 Build Scripts

The project includes several build scripts:

- `npm run authors:build` - Updates GitHub author data from markdown frontmatter
- `npm run changelogs:build` - Builds changelog data from GitHub releases
- `npm run build` - Production build
- `npm run check` - TypeScript type checking
- `npm run lint` - Code linting
- `npm run format` - Code formatting

## 🤖 Development Tools

### Environment Setup

Create a `.env` file for local development:

```env
# Sentry (optional, for error tracking)
SENTRY_AUTH_TOKEN=your_sentry_token

# GitHub (for build scripts)
GITHUB_TOKEN=your_github_token
```

### Debugging

- **Use browser dev tools** for frontend debugging
- **Check Network tab** for API calls
- **Use console.log** for temporary debugging (remove before committing)
- **Svelte DevTools** browser extension for component debugging

## 📋 Code Review Process

All contributions go through code review:

1. **Automated checks** must pass (linting, type checking, tests)
2. **Manual review** by maintainers
3. **Feedback and iteration** as needed
4. **Approval and merge** by maintainers

## 🎯 Priority Areas

We're currently focusing on:

- **Data accuracy** and completeness
- **API performance** and reliability
- **Mobile responsiveness** and accessibility
- **Search functionality** improvements
- **Documentation** and developer experience

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Documentation**: Check existing docs first
- **Existing Issues**: Look for similar issues before creating new ones

## 🙏 Recognition

Contributors are recognized in several ways:

- **GitHub Contributors** list
- **Release notes** mention significant contributions
- **Special thanks** in documentation
- **Community recognition** in project communications

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License as the project.

---

Thank you for contributing to Open Brewery DB! Your help makes this project better for everyone. 🍺
