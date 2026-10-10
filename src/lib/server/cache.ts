/**
 * Edge-cache TTL (seconds) for GET page responses. Used by the server handle
 * hook so Cloudflare's CDN can serve repeat hits without invoking the Worker
 * (requires a zone Cache Rule set to "Eligible for cache"). Browsers still
 * revalidate on every load (the hook sets `max-age=0`); only shared caches
 * hold the copy for this long.
 */
export function edgeCacheTtl(pathname: string): number {
  // Metrics-backed pages refresh hourly; brewery detail pages can render a
  // 200 "not found" for unknown ids, so don't let those go stale for a day.
  if (
    pathname === '/' ||
    pathname.startsWith('/stats') ||
    pathname.startsWith('/b/')
  ) {
    return 3600;
  }
  return 86400;
}

/**
 * Full cache-control value for GET responses. Browsers always revalidate
 * (max-age=0); shared caches keep the copy for s-maxage, serve it while
 * revalidating, and may serve it stale through origin 5xxs. Cache hits also
 * skip the Worker entirely, which is what preserves the daily quota.
 * Dynamic 404s get a short TTL so bot retries (e.g. bad brewery ids) don't
 * re-invoke the Worker, without pinning a wrong answer to the edge for a day.
 */
export function edgeCacheControl(pathname: string, status: number): string {
  const ttl = status === 404 ? 300 : edgeCacheTtl(pathname);
  return `max-age=0, s-maxage=${ttl}, stale-while-revalidate=60, stale-if-error=86400`;
}
