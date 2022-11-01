<script>
  import BreweriesTable from '../../../components/BreweriesTable.svelte';

  /** @type {import('./$types').PageData} */
  export let data;
</script>

<div class="px-4 sm:px-6 lg:px-8">
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-xl font-semibold text-gray-900">
        Breweries in {data.breweries[0]?.country ?? ''} ({data.breweries.length}
        breweries)
      </h1>
    </div>
  </div>
  <div class="mt-8 flex flex-col">
    <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div
          class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
        >
          <BreweriesTable breweries={data.breweries} />
        </div>
      </div>
    </div>
  </div>
</div>
