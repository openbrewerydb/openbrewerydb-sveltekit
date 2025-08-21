import { API_URL } from '$lib/utils';

interface BreweryMetaResponse {
  total: string;
  by_state: Record<string, number>;
  by_type: Record<string, number>;
}

export async function load() {
  try {
    const response = await fetch(`${API_URL}/breweries/meta`);

    if (!response.ok) {
      console.error(`❌ API request failed with status ${response.status}`);
      return {
        byState: [],
        byType: [],
        error: `Failed to fetch metadata with status ${response.status}`,
      };
    }

    const data: BreweryMetaResponse = await response.json();

    const byState = Object.entries(data.by_state)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const byType = Object.entries(data.by_type)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      byState,
      byType,
    };
  } catch (error) {
    console.error('❌ Error fetching brewery metadata:', error);
    return {
      byState: [],
      byType: [],
      error: 'Failed to fetch brewery metadata',
    };
  }
}
