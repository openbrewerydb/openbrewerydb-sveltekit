import type { PageServerLoad } from './$types';
import { getMetrics } from '$lib/server/metrics';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
  const { metrics, cache } = await getMetrics(fetch);
  setHeaders({ 'x-obdb-cache': cache });

  return {
    metrics,
    error: metrics ? null : 'Metrics unavailable',
  };
};
