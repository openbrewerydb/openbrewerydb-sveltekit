<script>
  import { snakeCase } from 'snake-case';
  import BreweriesTable from '../../../../../components/BreweriesTable.svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  $: firstBrewery = data.breweries[0];
  $: state = firstBrewery?.county_province
    ? firstBrewery?.county_province
    : firstBrewery?.state;
  $: country = firstBrewery?.country ?? '';
  $: page = data.page ?? 1;
</script>

<div class="px-4 sm:px-6 lg:px-8">
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-xl font-semibold text-gray-900">
        Breweries in {state ?? ''}, {country ?? ''}
        ({data.breweries.length} breweries)
      </h1>
      <p class="mt-2 text-sm text-gray-700">Page: {page}</p>
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
        <ul class="mt-4 flex gap-4">
          {#if page > 1}
            <li>
              <a
                href="/breweries/{snakeCase(country)}/{snakeCase(
                  state
                )}/{+page - 1}"
                class="underline">Previous</a
              >
            </li>
          {/if}
          <li>
            <a
              href="/breweries/{snakeCase(country)}/{snakeCase(state)}/{+page +
                1}"
              class="underline">Next</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
