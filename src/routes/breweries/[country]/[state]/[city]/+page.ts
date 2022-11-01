/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  // TODO: Check for valid country, state, and city first

  const res = await fetch(
    `https://api.openbrewerydb.org/breweries/?by_country=${params.country}&by_state=${params.state}&by_city=${params.city}`
  );
  const breweries = await res.json();
  return { breweries };
}
