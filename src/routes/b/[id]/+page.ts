import { error } from '@sveltejs/kit';
import * as Sentry from '@sentry/sveltekit';
import type { PageLoad } from './$types';
import type { Brewery } from '#lib/types.js';
import { API_URL, BREWERY_ID_REGEX } from '#lib/utils.js';

export const ssr = false;

export const load: PageLoad = async ({ fetch, params, setHeaders }) => {
  const { id } = params;

  if (id.length !== 36 || !BREWERY_ID_REGEX.test(id)) {
    error(404, 'Brewery not found');
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/breweries/${id.toLowerCase()}`);
  } catch {
    setHeaders({ 'cache-control': 'no-store' });
    error(503, 'Brewery data is temporarily unavailable');
  }

  if (response.status === 404) {
    Sentry.metrics.count('brewery_view', 1, {
      attributes: { status: 'not_found' },
    });
    error(404, 'Brewery not found');
  }

  if (!response.ok) {
    setHeaders({ 'cache-control': 'no-store' });
    error(503, 'Brewery data is temporarily unavailable');
  }

  let brewery: Brewery;
  try {
    brewery = await response.json();
  } catch {
    setHeaders({ 'cache-control': 'no-store' });
    error(502, 'Brewery data returned an invalid response');
  }

  Sentry.metrics.count('brewery_view', 1, { attributes: { status: 'found' } });
  return { brewery, id };
};
