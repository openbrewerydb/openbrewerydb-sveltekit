import type { Brewery, Metadata } from '$lib/types';
import { API_URL } from '$lib/utils';

const store = $state({
  breweries: [] as Brewery[],
  meta: { total: '0', page: '1', per_page: '20' } as Metadata,
  loading: false,
  error: null as string | null,
  searchQuery: '',
});

export function getBreweries() {
  return store.breweries;
}
export function getMeta() {
  return store.meta;
}
export function getLoading() {
  return store.loading;
}
export function getError() {
  return store.error;
}
export function getSearchQuery() {
  return store.searchQuery;
}

const hasBreweries = $derived(store.breweries.length > 0);
const totalBreweries = $derived(parseInt(store.meta.total) || 0);
const currentPage = $derived(parseInt(store.meta.page) || 1);
const itemsPerPage = $derived(parseInt(store.meta.per_page) || 20);
const totalPages = $derived(Math.ceil(totalBreweries / itemsPerPage) || 1);
const hasNextPage = $derived(currentPage < totalPages);
const hasPreviousPage = $derived(currentPage > 1);

export function getHasBreweries() {
  return hasBreweries;
}
export function getTotalBreweries() {
  return totalBreweries;
}
export function getCurrentPage() {
  return currentPage;
}
export function getItemsPerPage() {
  return itemsPerPage;
}
export function getTotalPages() {
  return totalPages;
}
export function getHasNextPage() {
  return hasNextPage;
}
export function getHasPreviousPage() {
  return hasPreviousPage;
}

export function initializeStore(
  initialBreweries: Brewery[] = [],
  initialMeta: Metadata = { total: '0', page: '1', per_page: '20', query: '' }
) {
  console.log(
    '🏁 Initializing store with',
    initialBreweries.length,
    'breweries'
  );
  store.breweries = initialBreweries;
  store.meta = initialMeta;
  store.searchQuery = initialMeta.query || '';
  console.log(
    '🏁 After initialization:',
    store.breweries.length,
    'breweries in store'
  );
}

export async function search(query: string) {
  console.log('🔍 Search called with query:', query);
  store.loading = true;
  store.error = null;
  store.searchQuery = query;

  try {
    const url = `${API_URL}/breweries/search?query=${encodeURIComponent(query)}`;
    console.log('🌐 Fetching from URL:', url);
    const response = await fetch(url);
    console.log('🌐 Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Search failed with status ${response.status}`);
    }

    const responseText = await response.text();
    console.log('🌐 Raw response:', responseText.substring(0, 200) + '...');

    let data: Brewery[];
    try {
      data = JSON.parse(responseText);
      console.log('📊 Parsed data successfully');
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      throw new Error('Failed to parse API response');
    }

    console.log('📊 Received data:', data.length, 'breweries', data[0]);
    console.log(
      '🔄 Before update, breweries state:',
      store.breweries.length,
      'items'
    );
    store.breweries = data;
    console.log(
      '🔄 After update, breweries state:',
      store.breweries.length,
      'items'
    );

    store.meta.total = data.length.toString();
    store.meta.page = '1';
    store.meta.per_page = data.length.toString();
    console.log('📝 Updated meta:', store.meta);
  } catch (e) {
    if (e instanceof Error) {
      store.error = e.message;
    } else {
      store.error = 'An unknown error occurred';
    }
    store.breweries = [];
  } finally {
    store.loading = false;
  }
}

export function resetSearch() {
  console.log('🧹 Resetting search');
  store.searchQuery = '';
  store.breweries = [];
  store.meta.total = '0';
  store.meta.page = '1';
  store.meta.per_page = '20';
  store.error = null;
  console.log('🧹 Reset complete, breweries:', store.breweries.length);
}

export async function goToPage(page: number) {
  if (
    page < 1 ||
    page > totalPages ||
    page === currentPage ||
    !store.searchQuery
  )
    return;

  console.log('📄 Going to page:', page);
  store.loading = true;
  store.error = null;

  try {
    const url = `${API_URL}/breweries/search?query=${encodeURIComponent(store.searchQuery)}&page=${page}&per_page=${itemsPerPage}`;
    console.log('🌐 Fetching page URL:', url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch page');
    }

    const data: Brewery[] = await response.json();
    console.log('📊 Received page data:', data.length, 'breweries');

    store.breweries = data;
    store.meta.page = page.toString();
    console.log(
      '🔄 Updated to page',
      page,
      'with',
      store.breweries.length,
      'breweries'
    );
  } catch (e) {
    if (e instanceof Error) {
      store.error = e.message;
    } else {
      store.error = 'An unknown error occurred';
    }
  } finally {
    store.loading = false;
  }
}
