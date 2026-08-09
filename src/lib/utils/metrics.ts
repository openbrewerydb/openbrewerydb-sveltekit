import type { HourlySample, DailySample } from '$lib/types/metrics';

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

export function formatBytes(bytes: number): string {
  const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < UNITS.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${decimalFormatter.format(value)} ${UNITS[unitIndex]}`;
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

const STALE_THRESHOLD_MINUTES = 90;

export function isStale(
  isoString: string,
  minutesThreshold: number = STALE_THRESHOLD_MINUTES
): boolean {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  return diffMinutes > minutesThreshold;
}

export interface HourlyBucket {
  date: Date;
  api: number;
  www: number;
  other: number;
  total: number;
  visitsWww: number;
  visitsOther: number;
  bandwidth_bytes: number;
}

export function toHourly(samples: HourlySample[]): HourlyBucket[] {
  return samples.map((s) => ({
    date: new Date(s.timestamp),
    api: s.requests.api,
    www: s.requests.www,
    other: s.requests.other,
    total: s.requests.total,
    visitsWww: s.visits.www,
    visitsOther: s.visits.other,
    bandwidth_bytes: s.bandwidth_bytes,
  }));
}

export interface DailyBucket {
  date: Date;
  api: number;
  www: number;
  other: number;
  total: number;
  visitsWww: number;
  visitsOther: number;
  bandwidth_bytes: number;
}

export function toDaily(samples: DailySample[]): DailyBucket[] {
  return samples.map((s) => ({
    date: new Date(`${s.date}T00:00:00Z`),
    api: s.requests.api,
    www: s.requests.www,
    other: s.requests.other,
    total: s.requests.total,
    visitsWww: s.visits.www,
    visitsOther: s.visits.other,
    bandwidth_bytes: s.bandwidth_bytes,
  }));
}
