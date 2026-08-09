import type { MetricsPayload } from '$lib/types/metrics';

const METRICS_URL =
  'https://openbrewerydb-metrics.wandering-leaf-studios.workers.dev/';

function isValidPayload(value: unknown): value is MetricsPayload {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Partial<MetricsPayload>;
  return (
    typeof p.last_updated === 'string' &&
    p.hourly !== undefined &&
    p.daily !== undefined &&
    p.totals !== undefined
  );
}

/**
 * Fetch the latest metrics payload from the worker, using the Cloudflare
 * Cache API with a 1-hour TTL when available. This keeps the data layer
 * off KV and ensures one fetch per hour is cached at the edge.
 */
export async function getMetrics(
  fetchImpl: typeof fetch = globalThis.fetch
): Promise<MetricsPayload | null> {
  const request = new Request(METRICS_URL, {
    headers: { accept: 'application/json' },
  });

  const cfCache = (
    globalThis as typeof globalThis & { caches?: { default: Cache } }
  ).caches;

  if (cfCache?.default) {
    try {
      const cached = await cfCache.default.match(request);
      if (cached) {
        const parsed: unknown = await cached.json();
        if (isValidPayload(parsed)) return parsed;
      }
    } catch {
      // ignore and fetch live
    }
  }

  try {
    const response = await fetchImpl(request);
    if (!response.ok) return null;

    const parsed: unknown = await response.json();
    if (!isValidPayload(parsed)) return null;

    if (cfCache?.default) {
      try {
        const cacheResponse = new Response(JSON.stringify(parsed), {
          headers: {
            'content-type': 'application/json',
            'cache-control': 'public, max-age=3600',
          },
        });
        await cfCache.default.put(request, cacheResponse);
      } catch {
        // cache put is best-effort
      }
    }

    return parsed;
  } catch {
    return null;
  }
}
