<script>
  import BreweriesTable from '$lib/components/BreweriesTable.svelte';
  import BreweryCard from '$lib/components/BreweryCard.svelte';
  import DirectoryHeading from '$lib/components/DirectoryHeading.svelte';
  import DirectoryMeta from '$lib/components/DirectoryMeta.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import { locationString } from '$lib/utils';

  let { data } = $props();

  let breweries = $derived(data.breweries ?? []);
  let country = $derived(data.country ?? '');
  let city = $derived(data.city ?? '');
  let state = $derived(data.state ?? '');
  let meta = $derived(data.meta);
  let breweryType = $derived(data.breweryType);

  let pageTitle = $derived(
    `Breweries in ${locationString({
      country,
      state,
      city,
    })}${breweryType ? ` - ${breweryType}` : ''} | Open Brewery DB`
  );

  let pageDescription = $derived(
    `Breweries in ${locationString({
      country,
      state,
      city,
    })}${breweryType ? ` - ${breweryType} breweries` : ''} - Page ${meta.page}`
  );
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
</svelte:head>

<div class="px-4 sm:px-0">
  <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between">
    <div class="flex-1">
      <DirectoryHeading {country} {state} {city} />
      <DirectoryMeta {meta} />
    </div>
    <div class="mt-4 sm:mt-0">
      <Pagination
        {country}
        {state}
        {city}
        {meta}
        context="city"
        {breweryType}
      />
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
      <BreweriesTable {breweries} context="city" {country} {state} {city} />
    </div>
  </div>

  <div class="mt-6 flex justify-center sm:justify-end">
    <Pagination {country} {state} {city} {meta} context="city" {breweryType} />
  </div>
</div>
