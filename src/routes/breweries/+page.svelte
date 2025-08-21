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
      console.log('🔍 Calling search with query:', query);
      await search(query);
      console.log(
        '🔍 Search complete, breweries state:',
        getBreweries().length,
        'items'
      );
    } else {
      // Reset to empty state when search is cleared
      console.log('🧹 Resetting search');
      resetSearch();
      console.log(
        '🧹 Reset completed, breweries state:',
        getBreweries().length,
        'items'
      );
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
        {#if getBreweries().length > 0}
          <pre class="bg-gray-100 p-2 text-xs">Debug: Passing {getBreweries()
              .length} breweries to table</pre>
        {/if}
        <BreweriesTable
          breweries={getBreweries()}
          context="search"
          country=""
          state=""
          city=""
        />
      </div>
    </div>
  {/if}
</div>
