import type { PageServerLoad } from './$types';
import { getMetrics } from '$lib/server/metrics';
import { API_URL } from '$lib/utils';
import searchSuggestions from '$lib/data/search-suggestions.json';

export const load: PageServerLoad = async ({ fetch }) => {
  // Fetch live dataset metadata from the API
  let dbMetrics = null;
  try {
    const response = await fetch(`${API_URL}/breweries/meta`);
    if (response.ok) {
      const data = await response.json();
      dbMetrics = {
        total: parseInt(data.total) || 0,
        countriesCount: Object.keys(data.by_country ?? {}).length,
        statesCount: Object.keys(data.by_state ?? {}).length,
        typesCount: Object.keys(data.by_type ?? {}).length,
      };
    }
  } catch (error) {
    console.error('Error fetching brewery metadata for homepage:', error);
  }

  const metrics = await getMetrics(fetch);

  // Select 3 random search suggestions
  let selectedSuggestions: string[] = ['California', 'Dogfish', 'Portland'];
  if (Array.isArray(searchSuggestions) && searchSuggestions.length > 0) {
    const shuffled = [...searchSuggestions].sort(() => 0.5 - Math.random());
    selectedSuggestions = shuffled.slice(0, 3);
  }

  return {
    metrics,
    dbMetrics,
    searchSuggestions: selectedSuggestions,
  };
};
