<script>
  import BreweriesTable from '$lib/components/BreweriesTable.svelte';
  import Pagination from '$lib/components/Pagination.svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  $: breweries = data.breweries ?? [];
  $: firstBrewery = breweries[0];
  $: country = data.country ?? '';
  $: page = data.page ?? 1;
  $: state = data.state ?? '';
  $: stateLabel =
    (firstBrewery?.county_province
      ? firstBrewery.county_province
      : firstBrewery?.state) ?? '';
</script>

<div class="">
  <div class="sm:flex sm:items-end">
    <div class="sm:flex-auto">
      <h1 class="text-xl font-semibold text-gray-900">
        Breweries in {stateLabel ?? ''}, {firstBrewery.country ?? ''}
      </h1>
      <p class="mt-2 text-sm text-gray-700">
        {breweries.length}
        breweries (page {page})
      </p>
    </div>
    <Pagination {country} {state} {page} />
  </div>
  <div class="mt-8 flex flex-col">
    <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div
          class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
        >
          <BreweriesTable {breweries} />
        </div>
        <div class="flex justify-end">
          <Pagination {country} {state} {page} />
        </div>
      </div>
    </div>
  </div>
</div>
