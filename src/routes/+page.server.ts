import type { PageServerLoad } from './$types';
import type { MetricsData } from '$lib/types/metrics';
import { API_URL } from '$lib/utils';

export const load: PageServerLoad = async ({ platform, fetch }) => {
  // Fetch live dataset metadata from the API
  let dbMetrics = null;
  try {
    const response = await fetch(`${API_URL}/breweries/meta`);
    if (response.ok) {
      const data = await response.json();
      dbMetrics = {
        total: parseInt(data.total) || 0,
        countriesCount: Object.keys(data.by_country || {}).length,
        statesCount: Object.keys(data.by_state || {}).length,
        typesCount: Object.keys(data.by_type || {}).length,
      };
    }
  } catch (error) {
    console.error('Error fetching brewery metadata for homepage:', error);
  }

  // Load existing Cloudflare traffic metrics
  const kv = platform?.env?.OBDB_METRICS;
  let metrics = null;

  if (kv) {
    try {
      const value = await kv.get('transparency_dashboard', 'text');
      if (value) {
        metrics = JSON.parse(value) as MetricsData;
      }
    } catch (error) {
      console.error('Error loading metrics from KV:', error);
    }
  }

  return {
    metrics,
    dbMetrics,
  };
};

