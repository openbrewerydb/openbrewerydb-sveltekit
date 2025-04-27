import type { Brewery, Metadata } from '$lib/types';
import { API_URL } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
  const { page = '1', country } = params;
  const breweryType = url.searchParams.get('by_type');

  // TODO: Check for valid country

  // Build the API URL with optional brewery type filter
  let apiUrl = `${API_URL}/breweries/?by_country=${country}&page=${page ?? 1}`;
  let metaUrl = `${API_URL}/breweries/meta?by_country=${country}&page=${page ?? 1}`;
  
  if (breweryType) {
    apiUrl += `&by_type=${breweryType}`;
    metaUrl += `&by_type=${breweryType}`;
  }

  const breweryResults = await fetch(apiUrl);
  const metaResults = await fetch(metaUrl);

  const breweries: Brewery[] = await breweryResults.json();
  const meta: Metadata = await metaResults.json();

  return { breweries, meta, country, page, breweryType };
}
