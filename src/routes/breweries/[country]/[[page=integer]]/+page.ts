import { loadDirectory } from '$lib/loadDirectory';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
  const { page = '1', country } = params;
  const breweryType = url.searchParams.get('by_type');

  // TODO: Check for valid country

  const data = await loadDirectory({
    fetch,
    filters: { by_country: country },
    page,
    breweryType,
  });
  return { ...data, country };
}
