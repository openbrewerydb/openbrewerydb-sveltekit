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
    let breweries: Brewery[] = [];
    let meta: Metadata;

    if (query) {
      // Calculate start index and map it to API batch page number of size 200
      const svelteStart = (page - 1) * per_page;
      const apiPage = Math.floor(svelteStart / 200) + 1;
      const localOffset = svelteStart % 200;

      const apiUrl = `${API_URL}/breweries/search?query=${encodeURIComponent(query)}&page=${apiPage}&per_page=200`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        return {
          breweries: [],
          meta: {
            total: '0',
            page: page.toString(),
            per_page: per_page.toString(),
            query: query,
          },
          error: `Request failed with status ${response.status}`,
        };
      }

      const apiBreweries: Brewery[] = await response.json();
      breweries = apiBreweries.slice(localOffset, localOffset + per_page);

      let total: number;
      if (apiBreweries.length < 200) {
        // We reached the actual end of results
        total = (apiPage - 1) * 200 + apiBreweries.length;
      } else {
        // We got exactly 200 results, so there might be more beyond this batch.
        // We do progressive discovery beyond the currently fetched batch size.
        total = (apiPage - 1) * 200 + apiBreweries.length;
        if (localOffset + per_page >= apiBreweries.length) {
          total += per_page;
        }
      }

      meta = {
        total: total.toString(),
        page: page.toString(),
        per_page: per_page.toString(),
        query: query,
      };
    } else {
      let apiUrl = `${API_URL}/breweries/?page=${page}&per_page=${per_page}`;
      let metaUrl = `${API_URL}/breweries/meta?page=${page}&per_page=${per_page}`;

      if (byState) {
        apiUrl += `&by_state=${encodeURIComponent(byState)}`;
        metaUrl += `&by_state=${encodeURIComponent(byState)}`;
      }

      if (byType) {
        apiUrl += `&by_type=${encodeURIComponent(byType)}`;
        metaUrl += `&by_type=${encodeURIComponent(byType)}`;
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
            query: '',
          },
          error: `Request failed with status ${response.status}`,
        };
      }

      breweries = await response.json();
      const metaResult = await metaResponse.json();

      meta = {
        total: metaResult.total,
        page: page.toString(),
        per_page: per_page.toString(),
        query: '',
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
