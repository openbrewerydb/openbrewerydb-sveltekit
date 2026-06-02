<script lang="ts">
  import BreweriesTable from '$lib/components/BreweriesTable.svelte';
  import BreweryCard from '$lib/components/BreweryCard.svelte';
  import BrewerySearchForm from '$lib/components/BrewerySearchForm.svelte';
  import SearchPagination from '$lib/components/SearchPagination.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import SEO from '$lib/components/SEO.svelte';
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
  import { SvelteURLSearchParams } from 'svelte/reactivity';

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
      const params = new SvelteURLSearchParams(page.url.searchParams);
      params.set('page', newPage.toString());
      await goto(`/breweries?${params.toString()}`, { replaceState: true });
    }
  }

  function removeParam(param: string): string {
    const params = new SvelteURLSearchParams(page.url.searchParams);
    params.delete(param);
    params.delete('page');
    return params.toString();
  }
</script>

<SEO
  title="Search Breweries"
  description="Search and browse breweries from the Open Brewery DB dataset."
/>

<div class="px-4 py-8">
  <h1 class="text-3xl text-center font-bold mb-6">Search Breweries</h1>

  <div class="max-w-2xl mx-auto mb-8">
    <BrewerySearchForm
      onSearch={handleSearch}
      initialQuery={getSearchQuery()}
    />
  </div>

  {#if !getLoading() && !getError() && (page.url.searchParams.get('query') || page.url.searchParams.get('by_state') || page.url.searchParams.get('by_type'))}
    <div class="mb-6 flex flex-wrap gap-2.5 items-center">
      <span
        class="text-xs font-semibold uppercase tracking-wider text-amber-800/60 mr-1"
        >Active Filters:</span
      >
      {#if page.url.searchParams.get('query')}
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200"
        >
          Query: "{page.url.searchParams.get('query')}"
          <a
            href="/breweries?{removeParam('query')}"
            class="text-amber-500 hover:text-amber-800 font-bold ml-1 text-sm leading-none"
            >×</a
          >
        </span>
      {/if}
      {#if page.url.searchParams.get('by_state')}
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200"
        >
          State: {page.url.searchParams.get('by_state')}
          <a
            href="/breweries?{removeParam('by_state')}"
            class="text-orange-500 hover:text-orange-800 font-bold ml-1 text-sm leading-none"
            >×</a
          >
        </span>
      {/if}
      {#if page.url.searchParams.get('by_type')}
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200"
        >
          Type: {page.url.searchParams.get('by_type')}
          <a
            href="/breweries?{removeParam('by_type')}"
            class="text-yellow-500 hover:text-yellow-800 font-bold ml-1 text-sm leading-none"
            >×</a
          >
        </span>
      {/if}
      <a
        href="/breweries"
        class="text-xs text-amber-700 hover:text-amber-900 font-semibold underline decoration-dotted ml-2"
        >Clear All</a
      >
    </div>
  {/if}

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
    <div
      class="flex justify-between items-center flex-col md:flex-row gap-4 mb-6"
    >
      {#if getTotalBreweries() > 0}
        <div class="md:mb-0">
          <p class="text-gray-600 text-sm font-medium">
            Showing {(getCurrentPage() - 1) * getItemsPerPage() + 1}
            - {Math.min(
              getCurrentPage() * getItemsPerPage(),
              getTotalBreweries()
            )}
            of {getTotalBreweries().toLocaleString()} breweries (page {getCurrentPage()}
            of {getTotalPages()})
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
      {#each getBreweries() as brewery (brewery.id)}
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

    <div class="mt-6 flex justify-center sm:justify-end">
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
