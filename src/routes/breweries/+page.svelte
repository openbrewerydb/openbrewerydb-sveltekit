<script lang="ts">
  import BreweriesTable from '$lib/components/BreweriesTable.svelte';
  import BreweryCard from '$lib/components/BreweryCard.svelte';
  import BrewerySearchForm from '$lib/components/BrewerySearchForm.svelte';
  import {
    getBreweries,
    getLoading,
    getError,
    search,
    resetSearch,
    initializeStore,
    getHasBreweries,
    getHasNextPage,
    getHasPreviousPage,
    getCurrentPage,
    getTotalPages,
    getItemsPerPage,
    goToPage,
    getSearchQuery,
  } from '$lib/stores/breweries.svelte';

  let { data } = $props();

  // Initialize the store with data from the server
  console.log(
    '🏁 Page initializing with data:',
    data.breweries.length,
    'breweries'
  );
  initializeStore(data.breweries, data.meta);
  console.log(
    '🏁 After initialization, breweries state:',
    getBreweries().length,
    'items'
  );

  // Debug effect to monitor breweries changes
  $effect(() => {
    console.log('🔄 Breweries state changed:', getBreweries().length, 'items');
    console.log('🔄 hasBreweries derived value:', getHasBreweries());
  });

  async function handleSearch(query: string) {
    console.log('🔍 handleSearch called with query:', query);
    if (query) {
      // Navigate to the same page with query parameter
      window.location.href = `/breweries?query=${encodeURIComponent(query)}`;
    } else {
      // Reset to empty state when search is cleared
      console.log('🧹 Resetting search');
      resetSearch();
      // Remove query parameter from URL
      window.location.href = '/breweries';
    }
  }

  function handlePageChange(newPage: number) {
    if (newPage !== getCurrentPage()) {
      // Update the URL with the page parameter
      const url = new URL(window.location.href);
      url.searchParams.set('page', newPage.toString());

      // If we have a query, keep it
      const currentQuery = getSearchQuery();
      if (currentQuery) {
        url.searchParams.set('query', currentQuery);
      }

      // Navigate to the new URL
      window.location.href = url.toString();
    }
  }
</script>

<svelte:head>
  <title>Search Breweries | Open Brewery DB</title>
  <meta property="og:title" content="Search Breweries | Open Brewery DB" />
  <meta
    property="og:description"
    content="Search and browse breweries from the Open Brewery DB dataset."
  />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Search Breweries</h1>

  <BrewerySearchForm onSearch={handleSearch} />

  {#if getLoading()}
    <div class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"
      ></div>
    </div>
  {:else if getError()}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6"
    >
      <p>Error: {getError()}</p>
    </div>
  {:else if getBreweries().length > 0}
    {#if getSearchQuery()}
      <div class="mb-6">
        <p class="text-gray-600">
          Found {getBreweries().length} breweries matching "{getSearchQuery()}"
        </p>
      </div>
    {/if}

    <!-- Mobile view: Card layout -->
    <div class="grid grid-cols-1 gap-6 mt-6 md:hidden">
      {#each getBreweries() as brewery}
        <BreweryCard {brewery} />
      {/each}
    </div>

    <!-- Desktop view: Table layout -->
    <div class="mt-6">
      <div
        class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg"
      >
        <BreweriesTable
          breweries={getBreweries()}
          context="search"
          country=""
          state=""
          city=""
        />
      </div>
    </div>

    <!-- Pagination Controls -->
    {#if getTotalPages() > 1}
      <div class="flex justify-center mt-8 space-x-2">
        <button
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!getHasPreviousPage()}
          onclick={() => handlePageChange(getCurrentPage() - 1)}
        >
          Previous
        </button>

        <div class="flex space-x-1">
          {#each Array(Math.min(getTotalPages(), 10)) as _, i}
            {@const pageNum = i + 1}
            <button
              class="px-4 py-2 border rounded-md shadow-sm text-sm font-medium {pageNum ===
              getCurrentPage()
                ? 'bg-amber-600 text-white border-amber-600'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}"
              onclick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          {/each}
        </div>

        <button
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!getHasNextPage()}
          onclick={() => handlePageChange(getCurrentPage() + 1)}
        >
          Next
        </button>
      </div>
    {/if}
  {:else if getSearchQuery()}
    <div class="text-center py-12">
      <p class="text-gray-500">
        No breweries found matching "{getSearchQuery()}". Try a different search
        term.
      </p>
    </div>
  {:else}
    <div class="flex items-center justify-center text-center py-12">
      <div class="rounded-md shadow">
        <a
          href="/breweries/browse"
          class="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 md:py-4 md:text-lg md:px-10"
        >
          Browse Breweries
        </a>
      </div>
    </div>
  {/if}
</div>
