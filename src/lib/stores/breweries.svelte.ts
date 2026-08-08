import type { Brewery, Metadata } from '$lib/types';

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
export function getLoading() {
  return store.loading;
}
export function getError() {
  return store.error;
}
export function getSearchQuery() {
  return store.searchQuery;
}

const totalBreweries = $derived(parseInt(store.meta.total) || 0);
const currentPage = $derived(parseInt(store.meta.page) || 1);
const itemsPerPage = $derived(parseInt(store.meta.per_page) || 20);
const totalPages = $derived(Math.ceil(totalBreweries / itemsPerPage) || 1);

export function getCurrentPage() {
  return currentPage;
}
export function getItemsPerPage() {
  return itemsPerPage;
}
export function getTotalBreweries() {
  return totalBreweries;
}
export function getTotalPages() {
  return totalPages;
}

export function initializeStore(
  initialBreweries: Brewery[] = [],
  initialMeta: Metadata = { total: '0', page: '1', per_page: '20', query: '' }
) {
  store.breweries = initialBreweries;
  store.meta = initialMeta;
  store.searchQuery = initialMeta.query || '';
}

export function resetSearch() {
  store.searchQuery = '';
  store.breweries = [];
  store.meta.total = '0';
  store.meta.page = '1';
  store.meta.per_page = '20';
  store.error = null;
}
