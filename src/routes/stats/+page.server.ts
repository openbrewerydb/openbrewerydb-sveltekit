import type { PageServerLoad } from './$types';
import type { MetricsData } from '$lib/types/metrics';

const METRICS_WORKER_URL = 'https://openbrewerydb-metrics.wandering-leaf-studios.workers.dev';

export const load: PageServerLoad = async ({ platform, fetch }) => {
  const kv = platform?.env?.OBDB_METRICS;

  // Try KV binding first (production/configured environments)
  if (kv) {
    try {
      const value = await kv.get('transparency_dashboard', 'text');

      if (value) {
        const metrics: MetricsData = JSON.parse(value);
        return {
          metrics,
          error: null
        };
      }
    } catch (error) {
      console.error('Error loading metrics from KV:', error);
    }
  }

  // Fallback: fetch from metrics worker directly
  try {
    const response = await fetch(METRICS_WORKER_URL);

    if (!response.ok) {
      throw new Error(`Metrics worker returned ${response.status}`);
    }

    const metrics: MetricsData = await response.json();

    return {
      metrics,
      error: null
    };
  } catch (error) {
    console.error('Error fetching metrics from worker:', error);
    return {
      metrics: null,
      error: 'Metrics service unavailable'
    };
  }
};
