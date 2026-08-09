/**
 * Shared chart series definitions for the metrics dashboards.
 * All colors are Tailwind palette values; raw hexes are used for SVG fills.
 */

export type MetricSeriesKey = 'api' | 'www' | 'other';

export const METRIC_COLORS: Record<MetricSeriesKey, string> = {
  api: '#b45309', // amber-700
  www: '#f59e0b', // amber-500
  other: '#78716c', // stone-500
};

export const METRIC_LABELS: Record<MetricSeriesKey, string> = {
  api: 'API',
  www: 'Website',
  other: 'Other',
};
