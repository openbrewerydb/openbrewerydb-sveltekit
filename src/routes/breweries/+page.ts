import { API_URL } from '$lib/utils';
import type { Brewery, Metadata } from '$lib/types';

export async function load({ url }) {
  const query = url.searchParams.get('query') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const per_page = parseInt(url.searchParams.get('per_page') || '20');

  if (!query) {
    return {
      breweries: [],
      meta: {
        total: '0',
        page: page.toString(),
        per_page: per_page.toString(),
        query: '',
      },
    };
  }

  try {
    const searchUrl = `${API_URL}/breweries/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      return {
        breweries: [],
        meta: {
          total: '0',
          page: page.toString(),
          per_page: per_page.toString(),
          query,
        },
        error: `Search failed with status ${response.status}`,
      };
    }

    const breweries: Brewery[] = await response.json();

    const total =
      breweries.length >= per_page
        ? page * per_page + per_page
        : (page - 1) * per_page + breweries.length;

    const meta: Metadata = {
      total: total.toString(),
      page: page.toString(),
      per_page: per_page.toString(),
      query: query,
    };

    return {
      breweries,
      meta,
    };
  } catch (error) {
    console.error('❌ Error fetching brewery data:', error);
    return {
      breweries: [],
      meta: {
        total: '0',
        page: page.toString(),
        per_page: per_page.toString(),
        query,
      },
      error: 'Failed to fetch brewery data',
    };
  }
}
