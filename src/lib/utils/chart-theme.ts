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

/**
 * Shared LayerChart tooltip styling — keeps the amber-bordered white card
 * consistent across every chart and avoids repeating the same props object.
 */
export const CHART_TOOLTIP_PROPS = {
  tooltip: {
    root: {
      variant: 'none' as const,
      classes: {
        container:
          'bg-white border border-amber-300 rounded-lg shadow-md p-2 text-sm text-gray-800',
      },
    },
  },
};
