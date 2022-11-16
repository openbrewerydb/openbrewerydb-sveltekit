import { API_URL } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  const { country, state, page } = params;

  // TODO: Check for valid country and state first

  const res = await fetch(
    `${API_URL}/breweries/?by_country=${country}&by_state=${state}&page=${
      page ?? 1
    }`
  );
  const breweries = await res.json();
  return { breweries, country, state, page };
}
