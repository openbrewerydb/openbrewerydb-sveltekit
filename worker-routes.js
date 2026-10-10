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
  '/breweries',
  '/breweries/*',
  '/b/*',
];
