export async function load() {
  // Return an empty initial state for the breweries store
  // The search form will handle fetching data on user interaction
  return {
    breweries: [],
    meta: { total: '0', page: '1', per_page: '20' }
  };
}
