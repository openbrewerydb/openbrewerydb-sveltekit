import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatNumber,
  formatCompactNumber,
  formatBandwidth,
} from '../src/lib/utils/metrics.ts';

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
