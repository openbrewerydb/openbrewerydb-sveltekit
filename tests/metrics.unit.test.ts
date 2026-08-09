import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatCompactNumber,
  formatBytes,
  isStale,
  toDaily,
} from '../src/lib/utils/metrics';
import { getMetrics } from '../src/lib/server/metrics';

describe('formatters', () => {
  it('formatNumber produces en-US grouped output', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('formatCompactNumber produces en-US compact output', () => {
    expect(formatCompactNumber(1500000)).toBe('1.5M');
  });

  it('formatBytes scales through units', () => {
    expect(formatBytes(1)).toBe('1.00 B');
    expect(formatBytes(1024)).toBe('1.00 KB');
    expect(formatBytes(1024 * 1024)).toBe('1.00 MB');
    expect(formatBytes(1024 * 1024 * 1024 * 1.5)).toBe('1.50 GB');
    expect(formatBytes(1024 * 1024 * 1024 * 1024 * 1.5)).toBe('1.50 TB');
  });
});

describe('isStale', () => {
  it('returns true after the 90-minute threshold', () => {
    const past = new Date(Date.now() - 100 * 60 * 1000).toISOString();
    expect(isStale(past)).toBe(true);
  });

  it('returns false before the 90-minute threshold', () => {
    const recent = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    expect(isStale(recent)).toBe(false);
  });

  it('respects a custom threshold', () => {
    const recent = new Date(Date.now() - 30 * 1000).toISOString();
    expect(isStale(recent, 1)).toBe(false);

    const past = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    expect(isStale(past, 1)).toBe(true);
  });
});

describe('toDaily', () => {
  it('parses UTC day boundaries', () => {
    const [bucket] = toDaily([
      {
        date: '2026-08-09',
        requests: { api: 1, www: 2, other: 3, total: 6 },
        visits: { api: 0, www: 1, other: 1, total: 2 },
        bandwidth_bytes: 1024,
      },
    ]);

    expect(bucket.date.toISOString()).toBe('2026-08-09T00:00:00.000Z');
    expect(bucket.api).toBe(1);
    expect(bucket.www).toBe(2);
    expect(bucket.other).toBe(3);
    expect(bucket.visitsWww).toBe(1);
    expect(bucket.bandwidth_bytes).toBe(1024);
  });
});

describe('getMetrics', () => {
  const payload = {
    last_updated: '2026-08-09T00:00:00.000Z',
    hourly: {
      window_hours: 1,
      samples: [
        {
          timestamp: '2026-08-09T00:00:00.000Z',
          requests: { api: 1, www: 1, other: 1, total: 3 },
          visits: { api: 0, www: 1, other: 1, total: 2 },
          bandwidth_bytes: 1,
        },
      ],
    },
    daily: {
      window_days: 1,
      samples: [
        {
          date: '2026-08-08',
          requests: { api: 1, www: 1, other: 1, total: 3 },
          visits: { api: 0, www: 1, other: 1, total: 2 },
          bandwidth_bytes: 1,
        },
      ],
    },
    totals: {
      last_24_hours: {
        requests: { api: 1, www: 1, other: 1, total: 3 },
        visits: { api: 0, www: 1, other: 1, total: 2 },
        bandwidth_bytes: 1,
      },
      last_7_days: {
        requests: { api: 1, www: 1, other: 1, total: 3 },
        visits: { api: 0, www: 1, other: 1, total: 2 },
        bandwidth_bytes: 1,
      },
      requests_per_day_avg: 3,
    },
  };

  it('returns a valid payload on a successful fetch', async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response(JSON.stringify(payload), { status: 200 });
    const result = await getMetrics(fetchImpl);
    expect(result).toEqual(payload);
  });

  it('returns null on non-ok response', async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response('', { status: 500 });
    const result = await getMetrics(fetchImpl);
    expect(result).toBeNull();
  });

  it('returns null on unparseable body', async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response('not-json', { status: 200 });
    const result = await getMetrics(fetchImpl);
    expect(result).toBeNull();
  });

  it('returns null when required fields are missing', async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response(JSON.stringify({ last_updated: 'now' }), { status: 200 });
    const result = await getMetrics(fetchImpl);
    expect(result).toBeNull();
  });

  it('returns null when hourly samples are missing', async () => {
    const bad = { ...payload, hourly: { window_hours: 1 } };
    const fetchImpl: typeof fetch = async () =>
      new Response(JSON.stringify(bad), { status: 200 });
    const result = await getMetrics(fetchImpl);
    expect(result).toBeNull();
  });

  it('returns null when an hourly sample has non-numeric requests', async () => {
    const bad = {
      ...payload,
      hourly: {
        ...payload.hourly,
        samples: [
          {
            ...payload.hourly.samples[0],
            requests: { api: 'x', www: 1, other: 1, total: 3 },
          },
        ],
      },
    };
    const fetchImpl: typeof fetch = async () =>
      new Response(JSON.stringify(bad), { status: 200 });
    const result = await getMetrics(fetchImpl);
    expect(result).toBeNull();
  });

  it('returns null when a daily sample has an invalid date', async () => {
    const bad = {
      ...payload,
      daily: {
        ...payload.daily,
        samples: [
          {
            ...payload.daily.samples[0],
            date: 'not-a-date',
          },
        ],
      },
    };
    const fetchImpl: typeof fetch = async () =>
      new Response(JSON.stringify(bad), { status: 200 });
    const result = await getMetrics(fetchImpl);
    expect(result).toBeNull();
  });

  it('returns null when totals are missing', async () => {
    const bad = { ...payload, totals: undefined };
    const fetchImpl: typeof fetch = async () =>
      new Response(JSON.stringify(bad), { status: 200 });
    const result = await getMetrics(fetchImpl);
    expect(result).toBeNull();
  });
});
