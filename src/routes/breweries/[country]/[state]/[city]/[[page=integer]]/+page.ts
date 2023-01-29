import type { Brewery, Metadata } from '$lib/types';
import { API_URL } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  const { country, state, city, page } = params;

  // TODO: Check for valid country, state, and city

  const breweryResults = await fetch(
    `${API_URL}/breweries/?by_country=${country}&by_state=${state}&by_city=${city}&page=${
      page ?? 1
    }`
  );
  const metaResults = await fetch(
    `${API_URL}/breweries/meta?by_country=${country}&by_state=${state}&by_city=${city}&page=${
      page ?? 1
    }`
  );

  const breweries: Brewery[] = await breweryResults.json();
  const meta: Metadata = await metaResults.json();

  return { breweries, meta, country, state, city, page };
}
