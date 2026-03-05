import type { RequestHandler } from './$types';
import type { MetricsData } from '$lib/types/metrics';

const METRICS_WORKER_URL = 'https://openbrewerydb-metrics.wandering-leaf-studios.workers.dev';

export const GET: RequestHandler = async ({ platform, fetch }) => {
  const kv = platform?.env?.OBDB_METRICS;

  // Try KV binding first (production/configured environments)
  if (kv) {
    try {
      const value = await kv.get('transparency_dashboard', 'text');

      if (value) {
        const data: MetricsData = JSON.parse(value);
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'public, max-age=3600'
          }
        });
      }
    } catch (error) {
      console.error('Error fetching metrics from KV:', error);
    }
  }

  // Fallback: fetch from metrics worker directly
  try {
    const response = await fetch(METRICS_WORKER_URL);

    if (!response.ok) {
      throw new Error(`Metrics worker returned ${response.status}`);
    }

    const data: MetricsData = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error fetching metrics from worker:', error);
    return new Response(
      JSON.stringify({ error: 'Metrics service unavailable' }),
      {
        status: 500,
        headers: { 'content-type': 'application/json; charset=utf-8' }
      }
    );
  }
};
