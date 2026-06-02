import { API_URL } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { Brewery, Metadata } from '$lib/types';

export async function load({ url }) {
  const rawQuery = url.searchParams.get('query');
  const query = (rawQuery ?? '').trim();
  const byState = url.searchParams.get('by_state');
  const byType = url.searchParams.get('by_type');

  if (rawQuery !== null && query === '') {
    throw redirect(302, '/breweries');
  }

  const page = parseInt(url.searchParams.get('page') || '1');
  const per_page = parseInt(url.searchParams.get('per_page') || '20');

  if (!query && !byState && !byType) {
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
    let apiUrl: string;
    let metaUrl: string;

    if (query) {
      apiUrl = `${API_URL}/breweries/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}`;
      metaUrl = apiUrl;
    } else {
      apiUrl = `${API_URL}/breweries/?page=${page}&per_page=${per_page}`;
      metaUrl = `${API_URL}/breweries/meta?page=${page}&per_page=${per_page}`;

      if (byState) {
        apiUrl += `&by_state=${encodeURIComponent(byState)}`;
        metaUrl += `&by_state=${encodeURIComponent(byState)}`;
      }

      if (byType) {
        apiUrl += `&by_type=${encodeURIComponent(byType)}`;
        metaUrl += `&by_type=${encodeURIComponent(byType)}`;
      }
    }

    const response = await fetch(apiUrl);
    const metaResponse = await fetch(metaUrl);

    if (!response.ok) {
      return {
        breweries: [],
        meta: {
          total: '0',
          page: page.toString(),
          per_page: per_page.toString(),
          query: query || '',
        },
        error: `Request failed with status ${response.status}`,
      };
    }

    const breweries: Brewery[] = await response.json();

    let meta: Metadata;
    if (query) {
      const total =
        breweries.length >= per_page
          ? page * per_page + per_page
          : (page - 1) * per_page + breweries.length;

      meta = {
        total: total.toString(),
        page: page.toString(),
        per_page: per_page.toString(),
        query: query,
      };
    } else {
      const metaResult = await metaResponse.json();
      meta = {
        total: metaResult.total,
        page: page.toString(),
        per_page: per_page.toString(),
        query: query || '',
      };
    }

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
