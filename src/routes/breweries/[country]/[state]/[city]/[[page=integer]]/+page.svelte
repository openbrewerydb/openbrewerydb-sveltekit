<script>
  import BreweriesTable from '$lib/components/BreweriesTable.svelte';
  import DirectoryHeading from '$lib/components/DirectoryHeading.svelte';
  import DirectoryMeta from '$lib/components/DirectoryMeta.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import { locationString } from '$lib/utils';

  /** @type {import('./$types').PageData} */
  export let data;

  $: breweries = data.breweries ?? [];
  $: country = data.country ?? '';
  $: city = data.city ?? '';
  $: state = data.state ?? '';
  $: meta = data.meta;
  $: pageTitle = `Breweries in ${locationString({
    country,
    state,
    city,
  })} | Open Brewery DB`;
  $: pageDescription = `Breweries in ${locationString({
    country,
    state,
    city,
  })} - Page ${meta.page}`;
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
</svelte:head>

<div class="">
  <div class="sm:flex sm:items-end">
    <div class="sm:flex-auto">
      <DirectoryHeading {country} {state} {city} />
      <DirectoryMeta {meta} />
    </div>
    <Pagination {country} {state} {city} {meta} />
  </div>
  <div class="mt-3 flex flex-col">
    <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div
          class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
        >
          <BreweriesTable {breweries} />
        </div>
        <div class="flex justify-end">
          <Pagination {country} {state} {city} {meta} />
        </div>
      </div>
    </div>
  </div>
</div>
