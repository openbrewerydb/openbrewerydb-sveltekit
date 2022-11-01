/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  // TODO: Check for valid country first

  const res = await fetch(
    `https://api.openbrewerydb.org/breweries/?by_country=${params.country}`
  );
  const breweries = await res.json();
  return { breweries };
}
