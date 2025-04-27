import type { Brewery } from '$lib/types';
import { API_URL } from '$lib/utils';
export async function load({ fetch, params }) {
  const { id }: { id: string } = params;

  const breweryResults = await fetch(`${API_URL}/breweries/${id}`);
  let brewery: Brewery | null = null;
  if (breweryResults.ok) {
    brewery = await breweryResults.json();
  }
  return { brewery, id };
}
