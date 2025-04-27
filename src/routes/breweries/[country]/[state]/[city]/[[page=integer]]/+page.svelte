<script>
  import BreweriesTable from '$lib/components/BreweriesTable.svelte';
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
