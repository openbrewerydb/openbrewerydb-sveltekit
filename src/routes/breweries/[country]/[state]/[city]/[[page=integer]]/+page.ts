import { loadDirectory } from '$lib/loadDirectory';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
  const { country, state, city, page } = params;
  const breweryType = url.searchParams.get('by_type');

  // TODO: Check for valid country, state, and city

  const data = await loadDirectory({
    fetch,
    filters: { by_country: country, by_state: state, by_city: city },
    page,
    breweryType,
  });
  return { ...data, country, state, city };
}
