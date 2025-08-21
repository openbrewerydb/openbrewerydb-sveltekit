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

// Optimistic setters for UI responsiveness during navigation
export function setPage(page: number) {
  store.meta.page = Math.max(1, Math.floor(page)).toString();
}
export function setSearchQuery(query: string) {
  store.searchQuery = query;
}
export function setLoading(loading: boolean) {
  store.loading = loading;
}

export function initializeStore(
  initialBreweries: Brewery[] = [],
  initialMeta: Metadata = { total: '0', page: '1', per_page: '20', query: '' }
) {
  store.breweries = initialBreweries;
  store.meta = initialMeta;
  store.searchQuery = initialMeta.query || '';
}

export async function search(query: string) {
  store.loading = true;
  store.error = null;
  store.searchQuery = query;

  try {
    const url = `${API_URL}/breweries/search?query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Search failed with status ${response.status}`);
    }

    const responseText = await response.text();
    let data: Brewery[];
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      throw new Error('Failed to parse API response');
    }
    store.breweries = data;
    store.meta.total = data.length.toString();
    store.meta.page = '1';
    store.meta.per_page = data.length.toString();
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
  store.searchQuery = '';
  store.breweries = [];
  store.meta.total = '0';
  store.meta.page = '1';
  store.meta.per_page = '20';
  store.error = null;
}

export async function goToPage(page: number) {
  if (
    page < 1 ||
    page > totalPages ||
    page === currentPage ||
    !store.searchQuery
  )
    return;

  store.loading = true;
  store.error = null;

  try {
    const url = `${API_URL}/breweries/search?query=${encodeURIComponent(store.searchQuery)}&page=${page}&per_page=${itemsPerPage}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch page');
    }

    const data: Brewery[] = await response.json();
    store.breweries = data;
    store.meta.page = page.toString();
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
