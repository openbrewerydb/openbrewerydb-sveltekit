import { describe, it, expect } from 'vitest';
import {
  isValidISODateTime,
  isValidISODate,
  isValidPayload,
} from '$lib/server/metrics';
import type { MetricsPayload } from '$lib/types/metrics';

const validBreakdown = { api: 1, www: 2, other: 3, total: 6 };

const validPayload: MetricsPayload = {
  last_updated: '2024-01-15T10:30:00Z',
  hourly: {
    window_hours: 24,
    samples: [
      {
        timestamp: '2024-01-15T10:00:00Z',
        requests: validBreakdown,
        visits: validBreakdown,
        bandwidth_bytes: 1000,
      },
    ],
  },
  daily: {
    window_days: 7,
    samples: [
      {
        date: '2024-01-14',
        requests: validBreakdown,
        visits: validBreakdown,
        bandwidth_bytes: 5000,
      },
    ],
  },
  totals: {
    last_24_hours: {
      requests: validBreakdown,
      visits: validBreakdown,
      bandwidth_bytes: 1000,
    },
    last_7_days: {
      requests: validBreakdown,
      visits: validBreakdown,
      bandwidth_bytes: 5000,
    },
    requests_per_day_avg: 42,
  },
};

describe('isValidISODateTime', () => {
  it('accepts valid ISO datetime with Z', () => {
    expect(isValidISODateTime('2024-01-15T10:30:00Z')).toBe(true);
  });

  it('accepts valid ISO datetime with offset', () => {
    expect(isValidISODateTime('2024-01-15T10:30:00+05:00')).toBe(true);
  });

  it('accepts fractional seconds', () => {
    expect(isValidISODateTime('2024-01-15T10:30:00.123Z')).toBe(true);
  });

  it('rejects Feb 30 (round-trip check)', () => {
    expect(isValidISODateTime('2024-02-30T00:00:00Z')).toBe(false);
  });

  it('rejects month 13', () => {
    expect(isValidISODateTime('2024-13-01T00:00:00Z')).toBe(false);
  });

  it('rejects hour 25', () => {
    expect(isValidISODateTime('2024-01-15T25:00:00Z')).toBe(false);
  });

  it('rejects non-ISO format', () => {
    expect(isValidISODateTime('01/15/2024 10:30:00')).toBe(false);
  });

  it('rejects date-only string', () => {
    expect(isValidISODateTime('2024-01-15')).toBe(false);
  });
});

describe('isValidISODate', () => {
  it('accepts valid ISO date', () => {
    expect(isValidISODate('2024-01-15')).toBe(true);
  });

  it('rejects Feb 30 (round-trip check)', () => {
    expect(isValidISODate('2024-02-30')).toBe(false);
  });

  it('rejects month 13', () => {
    expect(isValidISODate('2024-13-01')).toBe(false);
  });

  it('rejects full datetime string', () => {
    expect(isValidISODate('2024-01-15T10:30:00Z')).toBe(false);
  });

  it('rejects non-ISO format', () => {
    expect(isValidISODate('01/15/2024')).toBe(false);
  });
});

describe('isValidPayload', () => {
  it('accepts a valid payload', () => {
    expect(isValidPayload(validPayload)).toBe(true);
  });

  it('rejects invalid last_updated', () => {
    expect(isValidPayload({ ...validPayload, last_updated: '2024-02-30T00:00:00Z' })).toBe(false);
  });

  it('rejects non-ISO last_updated', () => {
    expect(isValidPayload({ ...validPayload, last_updated: 'Jan 15 2024' })).toBe(false);
  });

  it('rejects invalid hourly timestamp', () => {
    const bad = structuredClone(validPayload);
    bad.hourly.samples[0].timestamp = '2024-02-30T00:00:00Z';
    expect(isValidPayload(bad)).toBe(false);
  });

  it('rejects invalid daily date', () => {
    const bad = structuredClone(validPayload);
    bad.daily.samples[0].date = '2024-02-30';
    expect(isValidPayload(bad)).toBe(false);
  });

  it('rejects non-object', () => {
    expect(isValidPayload(null)).toBe(false);
    expect(isValidPayload('string')).toBe(false);
  });
});
