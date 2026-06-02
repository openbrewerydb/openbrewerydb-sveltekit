import type { PageServerLoad } from './$types';
import type { MetricsData } from '$lib/types/metrics';
import fallbackMetrics from '$lib/data/fallback-metrics.json';

export const load: PageServerLoad = async ({ platform }) => {
  const kv = platform?.env?.OBDB_METRICS;

  if (!kv) {
    return {
      metrics: fallbackMetrics as MetricsData,
      error: 'Metrics service is offline. Showing offline fallback statistics.',
    };
  }

  try {
    const value = await kv.get('transparency_dashboard', 'text');

    if (!value) {
      return {
        metrics: fallbackMetrics as MetricsData,
        error:
          'Live metrics data not found. Showing offline fallback statistics.',
      };
    }

    const metrics: MetricsData = JSON.parse(value);

    return {
      metrics,
      error: null,
    };
  } catch (error) {
    console.error('Error loading metrics from KV:', error);
    return {
      metrics: fallbackMetrics as MetricsData,
      error:
        'Failed to load live metrics. Showing offline fallback statistics.',
    };
  }
};
