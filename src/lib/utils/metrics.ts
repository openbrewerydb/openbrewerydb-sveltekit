import type {
  MetricsBreakdown,
  MetricsHistory,
  MetricsSample,
} from '$lib/types/metrics';

const numberFormatter = new Intl.NumberFormat('en-US');
const decimalFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

export function formatNumber(num: number): string {
  return numberFormatter.format(num);
}

export function formatCompactNumber(num: number): string {
  return compactFormatter.format(num);
}

export function formatBandwidth(tb: number): string {
  if (tb >= 1) {
    return `${decimalFormatter.format(tb)} TB`;
  }
  const gb = tb * 1024;
  if (gb >= 1) {
    return `${decimalFormatter.format(gb)} GB`;
  }
  const mb = gb * 1024;
  return `${decimalFormatter.format(mb)} MB`;
}

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}

export function formatAbsoluteTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

export function isDataStale(
  isoString: string,
  hoursThreshold: number = 48
): boolean {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours > hoursThreshold;
}

export const DEFAULT_TREND_WINDOW_HOURS = 24;

export interface TrendBucket {
  timestamp: Date;
  requests: MetricsBreakdown | null;
  visits: MetricsBreakdown | null;
  bandwidth_tb: number | null;
}

const HOUR_MS = 60 * 60 * 1000;

/**
 * Expand a MetricsHistory into a fixed-width window of hourly buckets
 * (oldest -> newest). Every bucket carries a `timestamp` so the chart's
 * x-axis spans the full window; buckets with no sample have `null`
 * metric fields so d3's `defined` accessor renders a gap there. Buckets
 * before the first real sample are also null, so the line "builds up"
 * from the first sample rather than starting mid-window.
 */
export function normalizeHistory(
  history: MetricsHistory | null | undefined,
  windowHours?: number
): TrendBucket[] {
  if (
    !history ||
    !Array.isArray(history.samples) ||
    history.samples.length === 0
  ) {
    return [];
  }

  const window =
    windowHours ?? history.window_hours ?? DEFAULT_TREND_WINDOW_HOURS;

  const byHour = new Map<number, MetricsSample>();
  let newestMs = 0;
  for (const sample of history.samples) {
    const ts = new Date(sample.timestamp).getTime();
    if (Number.isNaN(ts)) continue;
    const bucketMs = Math.floor(ts / HOUR_MS) * HOUR_MS;
    byHour.set(bucketMs, sample);
    if (bucketMs > newestMs) newestMs = bucketMs;
  }

  if (newestMs === 0) return [];

  const buckets: TrendBucket[] = [];
  for (let i = window - 1; i >= 0; i--) {
    const bucketMs = newestMs - i * HOUR_MS;
    const sample = byHour.get(bucketMs);
    buckets.push({
      timestamp: new Date(bucketMs),
      requests: sample?.requests ?? null,
      visits: sample?.visits ?? null,
      bandwidth_tb: sample?.bandwidth_tb ?? null,
    });
  }

  return buckets;
}
