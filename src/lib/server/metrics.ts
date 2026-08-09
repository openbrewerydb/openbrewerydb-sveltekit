import type { MetricsBreakdown, MetricsPayload } from '$lib/types/metrics';

const METRICS_URL =
  'https://openbrewerydb-metrics.wandering-leaf-studios.workers.dev/';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isMetricsBreakdown(value: unknown): value is MetricsBreakdown {
  return (
    isRecord(value) &&
    typeof value.api === 'number' &&
    typeof value.www === 'number' &&
    typeof value.other === 'number' &&
    typeof value.total === 'number'
  );
}

function isValidPayload(value: unknown): value is MetricsPayload {
  if (!isRecord(value)) return false;

  if (
    typeof value.last_updated !== 'string' ||
    Number.isNaN(Date.parse(value.last_updated))
  ) {
    return false;
  }

  if (
    !isRecord(value.hourly) ||
    typeof value.hourly.window_hours !== 'number' ||
    !Array.isArray(value.hourly.samples)
  ) {
    return false;
  }

  for (const sample of value.hourly.samples) {
    if (
      !isRecord(sample) ||
      typeof sample.timestamp !== 'string' ||
      Number.isNaN(Date.parse(sample.timestamp)) ||
      !isMetricsBreakdown(sample.requests) ||
      !isMetricsBreakdown(sample.visits) ||
      typeof sample.bandwidth_bytes !== 'number'
    ) {
      return false;
    }
  }

  if (
    !isRecord(value.daily) ||
    typeof value.daily.window_days !== 'number' ||
    !Array.isArray(value.daily.samples)
  ) {
    return false;
  }

  for (const sample of value.daily.samples) {
    if (
      !isRecord(sample) ||
      typeof sample.date !== 'string' ||
      Number.isNaN(Date.parse(`${sample.date}T00:00:00Z`)) ||
      !isMetricsBreakdown(sample.requests) ||
      !isMetricsBreakdown(sample.visits) ||
      typeof sample.bandwidth_bytes !== 'number'
    ) {
      return false;
    }
  }

  if (!isRecord(value.totals)) return false;

  for (const key of ['last_24_hours', 'last_7_days'] as const) {
    const total = value.totals[key];
    if (
      !isRecord(total) ||
      !isMetricsBreakdown(total.requests) ||
      !isMetricsBreakdown(total.visits) ||
      typeof total.bandwidth_bytes !== 'number'
    ) {
      return false;
    }
  }

  if (typeof value.totals.requests_per_day_avg !== 'number') return false;

  return true;
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
