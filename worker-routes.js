/**
 * Only these path prefixes invoke the Pages Function; everything else is
 * served static assets or a static 404. Each request that reaches the Worker
 * counts against the shared 100k/day free quota, so scanner paths must never
 * match. Wildcards follow Cloudflare _routes.json semantics.
 */
export const workerRoutes = [
  '/',
  '/__data.json',
  '/stats',
  '/stats/',
  '/stats/__data.json',
];

/**
 * Client-rendered routes served by the SPA fallback (index.html) on asset
 * miss. These must be in _routes.json exclude so adapter-cloudflare's
 * `fallback: 'spa'` serves the shell instead of a plaintext 404 — and they
 * must stay OUT of `workerRoutes` so enumeration of /b/<uuid> or
 * /breweries/<state>/<city> never reaches the Function.
 */
export const spaRoutes = ['/b', '/b/*', '/breweries', '/breweries/*'];
