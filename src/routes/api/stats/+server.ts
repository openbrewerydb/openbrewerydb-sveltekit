import type { RequestHandler } from '@sveltejs/kit';

// Stats endpoint using the OBDB meta API
// Source: https://api.openbrewerydb.org/v1/breweries/meta

type MetaResponse = {
  total: number;
  by_type?: Record<string, number>;
  by_state?: Record<string, number>;
  page?: number;
  per_page?: number;
};

export const GET: RequestHandler = async ({ fetch }) => {
  try {
    const url = 'https://api.openbrewerydb.org/v1/breweries/meta';
    const res = await fetch(url, { headers: { accept: 'application/json' } });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch brewery meta', status: res.status }),
        { status: 502, headers: { 'content-type': 'application/json' } }
      );
    }

    const meta: MetaResponse = await res.json();

    // Map by_type -> array matching the component's expected shape
    const byTypeEntries = Object.entries(meta.by_type ?? {});
    const data = byTypeEntries
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => (b.count - a.count) || a.type.localeCompare(b.type));

    return new Response(
      JSON.stringify({ data, total: meta.total, by_state: meta.by_state ?? {} }),
      {
        headers: {
          'content-type': 'application/json',
          'cache-control': 'no-store'
        }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: String(err) }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
};
