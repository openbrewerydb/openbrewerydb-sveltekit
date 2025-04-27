import type { Brewery, Metadata } from '$lib/types';
import { API_URL } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
  const { country, state, page } = params;
  const breweryType = url.searchParams.get('by_type');

  // TODO: Check for valid country and state first

  // Build the API URL with optional brewery type filter
  let apiUrl = `${API_URL}/breweries/?by_country=${country}&by_state=${state}&page=${page ?? 1
    }`;
  let metaUrl = `${API_URL}/breweries/meta?by_country=${country}&by_state=${state}&page=${page ?? 1
    }`;

  if (breweryType) {
    apiUrl += `&by_type=${breweryType}`;
    metaUrl += `&by_type=${breweryType}`;
  }

  const breweryResults = await fetch(apiUrl);
  const metaResults = await fetch(metaUrl);

  const breweries: Brewery[] = await breweryResults.json();
  const meta: Metadata = await metaResults.json();

  return { breweries, meta, country, state, page, breweryType };
}
