import type { PageServerLoad } from './$types';
import type { MetricsData } from '$lib/types/metrics';

export const load: PageServerLoad = async ({ platform }) => {
  const kv = platform?.env?.OBDB_METRICS;
  
  if (!kv) {
    return {
      metrics: null
    };
  }

  try {
    const value = await kv.get('transparency_dashboard', 'text');
    
    if (!value) {
      return {
        metrics: null
      };
    }

    const metrics: MetricsData = JSON.parse(value);
    
    return {
      metrics
    };
  } catch (error) {
    console.error('Error loading metrics from KV:', error);
    return {
      metrics: null
    };
  }
};
