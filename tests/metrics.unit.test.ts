import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatNumber,
  formatCompactNumber,
  formatBandwidth,
  normalizeHistory,
} from '../src/lib/utils/metrics.ts';
import type { MetricsHistory } from '../src/lib/types/metrics.ts';

// Pins locale to en-US so SSR and browser output match. Reverting to the
// runtime default locale breaks these assertions.
test('formatNumber produces en-US grouped output', () => {
  assert.equal(formatNumber(1234567), '1,234,567');
});

test('formatCompactNumber produces en-US compact output', () => {
  assert.equal(formatCompactNumber(1500000), '1.5M');
});

test('formatBandwidth produces en-US decimal output', () => {
  assert.equal(formatBandwidth(1.5), '1.50 TB');
  assert.equal(formatBandwidth(0.5), '512.00 GB');
});

const HOUR = 60 * 60 * 1000;
const baseHour = Date.UTC(2026, 0, 1, 12, 0, 0); // 2026-01-01 12:00 UTC
const iso = (offsetHours: number) =>
  new Date(baseHour + offsetHours * HOUR).toISOString();

function sample(offsetHours: number) {
  return {
    timestamp: iso(offsetHours),
    requests: { api: 100, www: 50, other: 0, total: 150 },
    visits: { api: 0, www: 30, other: 0, total: 30 },
    bandwidth_tb: 0.1,
  };
}

test('normalizeHistory returns empty for absent/empty history', () => {
  assert.deepEqual(normalizeHistory(null), []);
  assert.deepEqual(normalizeHistory(undefined), []);
  assert.deepEqual(normalizeHistory({ window_hours: 24, samples: [] }), []);
});

test('normalizeHistory fills a missing middle hour as null (gap)', () => {
  const history: MetricsHistory = {
    window_hours: 3,
    samples: [sample(0), sample(2)], // hour 1 missing
  };
  const buckets = normalizeHistory(history);
  assert.equal(buckets.length, 3);
  assert.equal(buckets[0].requests!.api, 100); // hour 0
  assert.equal(buckets[1].requests, null); // hour 1 gap
  assert.equal(buckets[2].requests!.api, 100); // hour 2
  // Every bucket has a timestamp spanning the window.
  assert.equal(
    buckets[2].timestamp.getTime() - buckets[0].timestamp.getTime(),
    2 * HOUR
  );
});

test('normalizeHistory builds up: buckets before first sample are null', () => {
  const history: MetricsHistory = {
    window_hours: 5,
    samples: [sample(3), sample(4)], // first sample at hour 3
  };
  const buckets = normalizeHistory(history);
  assert.equal(buckets.length, 5);
  assert.equal(buckets[0].requests, null); // before first sample
  assert.equal(buckets[1].requests, null);
  assert.equal(buckets[2].requests, null);
  assert.equal(buckets[3].requests!.api, 100); // first real sample
  assert.equal(buckets[4].requests!.api, 100);
});

test('normalizeHistory respects windowHours override', () => {
  const history: MetricsHistory = {
    window_hours: 24,
    samples: [sample(0), sample(1)],
  };
  const buckets = normalizeHistory(history, 2);
  assert.equal(buckets.length, 2);
});

test('normalizeHistory ignores samples with invalid timestamps', () => {
  const history: MetricsHistory = {
    window_hours: 2,
    samples: [{ ...sample(0), timestamp: 'not-a-date' }, sample(1)],
  };
  const buckets = normalizeHistory(history);
  assert.equal(buckets.length, 2);
  assert.equal(buckets[0].requests, null); // invalid -> gap
  assert.equal(buckets[1].requests!.api, 100);
});
