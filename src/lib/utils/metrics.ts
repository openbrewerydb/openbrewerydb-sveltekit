import { format } from 'd3-format';

const numberFormatter = format(',');
const decimalFormatter = format(',.2f');
const compactFormatter = format('.2~s');

export function formatNumber(num: number): string {
  return numberFormatter(num);
}

export function formatCompactNumber(num: number): string {
  return compactFormatter(num);
}

export function formatBandwidth(tb: number): string {
  if (tb >= 1) {
    return `${decimalFormatter(tb)} TB`;
  }
  const gb = tb * 1024;
  if (gb >= 1) {
    return `${decimalFormatter(gb)} GB`;
  }
  const mb = gb * 1024;
  return `${decimalFormatter(mb)} MB`;
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

export function isDataStale(isoString: string, hoursThreshold: number = 48): boolean {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours > hoursThreshold;
}
