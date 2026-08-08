import type { PageServerLoad } from './$types';
import type { MetricsData, MetricsHistory } from '$lib/types/metrics';

export const load: PageServerLoad = async ({ platform }) => {
  const kv = platform?.env?.OBDB_METRICS;

  if (!kv) {
    return {
      metrics: null,
      error: 'Metrics service unavailable',
    };
  }

  try {
    const value = await kv.get('transparency_dashboard', 'text');

    if (!value) {
      return {
        metrics: null,
        error: 'Metrics data not found',
      };
    }

    const metrics: MetricsData = JSON.parse(value);

    // Best-effort: hourly trend history lives in a separate key so the
    // snapshot is never touched by history writes. Absent until the
    // external worker starts populating it.
    try {
      const historyValue = await kv.get(
        'transparency_dashboard_history',
        'text'
      );
      if (historyValue) {
        metrics.history = JSON.parse(historyValue) as MetricsHistory;
      }
    } catch (error) {
      console.error('Error loading metrics history from KV:', error);
    }

    return {
      metrics,
      error: null,
    };
  } catch (error) {
    console.error('Error loading metrics from KV:', error);
    return {
      metrics: null,
      error: 'Failed to load metrics',
    };
  }
};
