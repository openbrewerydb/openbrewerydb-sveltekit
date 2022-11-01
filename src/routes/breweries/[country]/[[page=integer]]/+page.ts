/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  const { page, country } = params;

  // TODO: Check for valid country

  const res = await fetch(
    `https://api.openbrewerydb.org/breweries/?by_country=${country}&page=${
      page ?? 1
    }`
  );
  const breweries = await res.json();
  return { breweries, page };
}
