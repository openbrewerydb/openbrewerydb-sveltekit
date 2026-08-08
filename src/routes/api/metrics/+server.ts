import type { RequestHandler } from './$types';
import type { MetricsData, MetricsHistory } from '$lib/types/metrics';

export const GET: RequestHandler = async ({ platform }) => {
  const kv = platform?.env?.OBDB_METRICS;

  if (!kv) {
    return new Response(
      JSON.stringify({ error: 'Metrics service unavailable' }),
      {
        status: 500,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      }
    );
  }

  try {
    const value = await kv.get('transparency_dashboard', 'text');

    if (!value) {
      return new Response(JSON.stringify({ error: 'Metrics data not found' }), {
        status: 404,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }

    const data: MetricsData = JSON.parse(value);

    // Best-effort: hourly trend history lives in a separate key so the
    // snapshot is never touched by history writes. Absent until the
    // external worker starts populating it.
    try {
      const historyValue = await kv.get(
        'transparency_dashboard_history',
        'text'
      );
      if (historyValue) {
        data.history = JSON.parse(historyValue) as MetricsHistory;
      }
    } catch (error) {
      console.error('Error fetching metrics history:', error);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch metrics' }), {
      status: 500,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
};
