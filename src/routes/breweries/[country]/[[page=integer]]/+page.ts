import { API_URL } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  const { page, country } = params;

  // TODO: Check for valid country

  const res = await fetch(
    `${API_URL}/breweries/?by_country=${country}&page=${page ?? 1}`
  );
  const breweries = await res.json();
  return { breweries, country, page };
}
