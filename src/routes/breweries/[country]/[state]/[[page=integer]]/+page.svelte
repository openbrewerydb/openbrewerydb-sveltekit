<script>
  import BreweriesTable from '$lib/components/BreweriesTable.svelte';
  import BreweryCard from '$lib/components/BreweryCard.svelte';
  import DirectoryHeading from '$lib/components/DirectoryHeading.svelte';
  import DirectoryMeta from '$lib/components/DirectoryMeta.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import { locationString } from '$lib/utils';
  import SEO from '$lib/components/SEO.svelte';

  let { data } = $props();

  let breweries = $derived(data.breweries ?? []);
  let country = $derived(data.country ?? '');
  let state = $derived(data.state ?? '');
  let meta = $derived(data.meta);
  let breweryType = $derived(data.breweryType);

  let pageTitle = $derived(
    `Breweries in ${locationString({
      country,
      state,
    })}${breweryType ? ` - ${breweryType}` : ''} | Open Brewery DB`
  );

  let pageDescription = $derived(
    `Breweries in ${locationString({
      country,
      state,
    })}${breweryType ? ` - ${breweryType} breweries` : ''} - Page ${meta.page}`
  );
</script>

<SEO title={pageTitle} description={pageDescription} />

<div class="px-4 sm:px-0">
  <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between">
    <div class="flex-1">
      <DirectoryHeading {country} {state} />
      <DirectoryMeta {meta} />
    </div>
    <div class="mt-4 sm:mt-0">
      <Pagination {country} {state} {meta} context="state" {breweryType} />
    </div>
  </div>

  <!-- Mobile view: Card layout -->
  <div class="mt-6 grid grid-cols-1 gap-4 md:hidden">
    {#each breweries as brewery}
      <BreweryCard {brewery} />
    {/each}
  </div>

  <!-- Desktop view: Table layout -->
  <div class="mt-6 hidden md:block">
    <div
      class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg"
    >
      <BreweriesTable {breweries} context="state" {country} {state} />
    </div>
  </div>

  <div class="mt-6 flex justify-center sm:justify-end">
    <Pagination {country} {state} {meta} context="state" {breweryType} />
  </div>
</div>
