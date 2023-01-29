<script>
  import BreweriesTable from '$lib/components/BreweriesTable.svelte';
  import DirectoryHeading from '$lib/components/DirectoryHeading.svelte';
  import DirectoryMeta from '$lib/components/DirectoryMeta.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import { mappings } from '$lib/utils';

  /** @type {import('./$types').PageData} */
  export let data;

  $: breweries = data.breweries;
  $: meta = data.meta;
  $: country = data.country ?? '';
  $: countryLabel = mappings?.countries[country]?.label || '';
</script>

<svelte:head>
  <meta property="og:title" content={`Open Brewery DB - ${countryLabel}`} />
  <meta
    property="og:description"
    content={`List of breweries in ${countryLabel} - Page ${meta.page}`}
  />
</svelte:head>

<div class="">
  <div class="sm:flex sm:items-end">
    <div class="sm:flex-auto">
      <DirectoryHeading {country} />
      <DirectoryMeta {meta} />
    </div>
    <Pagination {country} {meta} />
  </div>
  <div class="mt-4 flex flex-col">
    <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div
          class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
        >
          <BreweriesTable {breweries} />
        </div>
        <div class="flex justify-end">
          <Pagination {country} {meta} />
        </div>
      </div>
    </div>
  </div>
</div>
