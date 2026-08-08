import { loadDirectory } from '$lib/loadDirectory';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
  const { country, state, page } = params;
  const breweryType = url.searchParams.get('by_type');

  // TODO: Check for valid country and state first

  const data = await loadDirectory({
    fetch,
    filters: { by_country: country, by_state: state },
    page,
    breweryType,
  });
  return { ...data, country, state };
}
