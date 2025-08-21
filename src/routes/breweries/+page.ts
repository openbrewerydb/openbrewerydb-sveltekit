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

  console.log(
    `🔍 Loading data for query: "${query}", page: ${page}, per_page: ${per_page}`
  );

  try {
    const searchUrl = `${API_URL}/breweries/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}`;
    console.log('🌐 Fetching from URL:', searchUrl);

    const response = await fetch(searchUrl);

    if (!response.ok) {
      console.error(`❌ API request failed with status ${response.status}`);
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
    console.log(`📊 Received ${breweries.length} breweries from API`);

    // Since the API doesn't return proper pagination metadata,
    // we'll estimate the total based on the current results
    const total =
      breweries.length >= per_page
        ? page * per_page + per_page // If we have a full page, assume there's at least one more
        : (page - 1) * per_page + breweries.length; // Otherwise, calculate based on current results

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
