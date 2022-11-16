import { API_URL } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  const { country, state, city, page } = params;

  // TODO: Check for valid country, state, and city

  const res = await fetch(
    `${API_URL}/breweries/?by_country=${country}&by_state=${state}&by_city=${city}&page=${
      page ?? 1
    }`
  );
  const breweries = await res.json();
  return { breweries, country, state, city, page };
}
