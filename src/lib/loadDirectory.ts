import { error } from '@sveltejs/kit';
import type { Brewery, Metadata } from '$lib/types';
import { API_URL, BREWERY_ID_REGEX } from '$lib/utils';

type Filters = {
  by_country: string;
  by_state?: string;
  by_city?: string;
};

/**
 * Loads a directory page (country / state / city) from the breweries API.
 * Returns breweries, meta, the resolved page, and the optional breweryType filter.
 */
export async function loadDirectory({
  fetch,
  filters,
  page,
  breweryType,
}: {
  fetch: typeof globalThis.fetch;
  filters: Filters;
  page: string | undefined;
  breweryType: string | null;
}) {
  // Probes like /breweries/<uuid> match [country] and would fan out to a
  // doomed API call; 404 before fetching.
  for (const value of Object.values(filters)) {
    if (value && BREWERY_ID_REGEX.test(value)) {
      error(404, 'Not found');
    }
  }

  const params = new URLSearchParams({ page: page ?? '1' });
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  if (breweryType) params.set('by_type', breweryType);

  const apiUrl = `${API_URL}/breweries/?${params}`;
  const metaUrl = `${API_URL}/breweries/meta?${params}`;

  const breweryResults = await fetch(apiUrl);
  const metaResults = await fetch(metaUrl);

  const breweries: Brewery[] = await breweryResults.json();
  const meta: Metadata = await metaResults.json();

  return {
    breweries,
    meta,
    page: page ?? '1',
    breweryType: breweryType ?? undefined,
  };
}
