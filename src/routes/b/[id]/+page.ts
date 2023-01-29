import type { Brewery } from '$lib/types';
import { API_URL } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  const { id }: { id: string } = params;

  const breweryResults = await fetch(`${API_URL}/breweries/${id}`);
  const brewery: Brewery = await breweryResults.json();
  return { brewery };
}
