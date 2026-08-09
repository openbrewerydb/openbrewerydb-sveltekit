import type { PageServerLoad } from './$types';
import { getMetrics } from '$lib/server/metrics';

export const load: PageServerLoad = async ({ fetch }) => {
  const metrics = await getMetrics(fetch);

  return {
    metrics,
    error: metrics ? null : 'Metrics unavailable',
  };
};
