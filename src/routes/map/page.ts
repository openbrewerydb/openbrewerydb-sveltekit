import type { BreweryMarker } from '$lib/types';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  const data = await fetch(`https://github.com/openbrewerydb/openbrewerydb/blob/1a5be9009b2e30f7ca7a5b1fd16d2ff5464aa6c7/breweries-map.json`);
  const markers: BreweryMarker[]  = await data.json();
  return { markers };
}
