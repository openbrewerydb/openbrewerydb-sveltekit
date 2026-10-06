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
