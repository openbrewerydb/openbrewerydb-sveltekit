import type { PageServerLoad } from './$types';
import { getMetrics, METRICS_SOURCE_URL } from '$lib/server/metrics';

export const load: PageServerLoad = async ({ fetch }) => {
  const metrics = await getMetrics(fetch);

  return {
    metrics,
    sourceUrl: METRICS_SOURCE_URL,
    error: metrics ? null : 'Metrics unavailable',
  };
};
