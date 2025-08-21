<script lang="ts">
  import BreweriesTable from '$lib/components/BreweriesTable.svelte';
  import BreweryCard from '$lib/components/BreweryCard.svelte';
  import BrewerySearchForm from '$lib/components/BrewerySearchForm.svelte';
  import SearchPagination from '$lib/components/SearchPagination.svelte';
  import { goto } from '$app/navigation';
  import {
    getBreweries,
    getLoading,
    getError,
    resetSearch,
    initializeStore,
    getHasNextPage,
    getHasPreviousPage,
    getCurrentPage,
    getItemsPerPage,
    getTotalBreweries,
    getTotalPages,
    getSearchQuery,
  } from '$lib/stores/breweries.svelte';

  let { data } = $props();

  $effect(() => {
    initializeStore(data.breweries, data.meta);
  });

  async function handleSearch(query: string) {
    const q = query.trim();
    if (q) {
      await goto(`/breweries?query=${encodeURIComponent(q)}`, {
        replaceState: true,
      });
    } else {
      resetSearch();
      await goto('/breweries', { replaceState: true });
    }
  }

  async function handlePageChange(newPage: number) {
    if (newPage !== getCurrentPage()) {
      const params = new URLSearchParams();
      params.set('page', newPage.toString());
      const currentQuery = getSearchQuery();
      if (currentQuery) params.set('query', currentQuery);
      await goto(`/breweries?${params.toString()}`, { replaceState: true });
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

<div class="px-4 py-8">
  <h1 class="text-3xl text-center font-bold mb-6">Search Breweries</h1>

  <div class="max-w-2xl mx-auto">
    <BrewerySearchForm onSearch={handleSearch} initialQuery={getSearchQuery()} />
  </div>

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
    <div class="flex justify-between items-center flex-col md:flex-row">
      {#if getSearchQuery()}
        <div class="mb-6 md:mb-0">
          <p class="text-gray-600">
            {(getCurrentPage() - 1) * getItemsPerPage() + 1}
            - {Math.min(
              getCurrentPage() * getItemsPerPage(),
              getTotalBreweries()
            )}
            of {getTotalBreweries()} breweries (page {getCurrentPage()} of {getTotalPages()})
          </p>
        </div>
      {/if}

      <SearchPagination
        currentPage={getCurrentPage()}
        totalPages={getTotalPages()}
        hasPrevious={getHasPreviousPage()}
        hasNext={getHasNextPage()}
        onPageChange={handlePageChange}
      />
    </div>

    <!-- Mobile view: Card layout -->
    <div class="grid grid-cols-1 gap-6 mt-6 md:hidden">
      {#each getBreweries() as brewery}
        <BreweryCard {brewery} />
      {/each}
    </div>

    <!-- Desktop view: Table layout -->
    <div class="mt-6 hidden md:block">
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

    <div class="mt-6">
      <SearchPagination
        currentPage={getCurrentPage()}
        totalPages={getTotalPages()}
        hasPrevious={getHasPreviousPage()}
        hasNext={getHasNextPage()}
        onPageChange={handlePageChange}
      />
    </div>
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
