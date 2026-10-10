import { describe, it, expect } from 'vitest';
import { workerRoutes } from '../worker-routes.js';

// Mirrors Cloudflare's wildcard semantics: `*` matches any characters,
// including `/`. Cloudflare's engine is authoritative — this guards against
// config regressions; the deployed smoke test checks the real thing.
function invokesWorker(pathname: string): boolean {
  return workerRoutes.some((rule) =>
    rule.endsWith('*')
      ? pathname.startsWith(rule.slice(0, -1))
      : pathname === rule
  );
}

describe('workerRoutes allowlist', () => {
  it('has no splat rule overlapping another rule (wrangler rejects those)', () => {
    const splats = workerRoutes.filter((r) => r.endsWith('*'));
    for (const rule of workerRoutes) {
      expect(splats.filter((s) => rule !== s && rule.startsWith(s.slice(0, -1)))).toEqual([]);
    }
  });

  it('is the exact explicit allowlist', () => {
    expect(workerRoutes).toEqual([
      '/',
      '/__data.json',
      '/stats',
      '/stats/',
      '/stats/__data.json',
      '/breweries',
      '/breweries/*',
      '/b/*',
    ]);
  });

  it.each([
    '/',
    '/__data.json',
    '/stats',
    '/stats/',
    '/stats/__data.json',
    '/breweries',
    '/breweries/',
    '/breweries/browse',
    '/breweries/united_states/ohio/columbus/2',
    '/b/b54b16e1-ac3b-4bff-a11f-f7ae9ddc27e0',
  ])('invokes the Worker for %s', (pathname) => {
    expect(invokesWorker(pathname)).toBe(true);
  });

  it.each([
    '/wp/',
    '/panel',
    '/auth/register',
    '/contact',
    '/favicon.ico',
    '/icons/favicon.ico',
    '/llms.txt',
    '/about',
    '/news/2025/08/introducing-news-and-changelog-pages',
    '/documentation',
    '/statsx',
    '/breweriesx',
    '/b',
  ])('does not invoke the Worker for %s', (pathname) => {
    expect(invokesWorker(pathname)).toBe(false);
  });
});
