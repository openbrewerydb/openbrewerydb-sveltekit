/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  // TODO: Check for valid country and state first
  const res = await fetch(
    `https://api.openbrewerydb.org/breweries/?by_country=${params.country}&by_state=${params.state}`
  );
  const breweries = await res.json();
  return { breweries };
}
