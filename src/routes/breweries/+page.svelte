<script lang="ts">
  import { mappings } from '$lib/utils';
</script>

<svelte:head>
  <title>Breweries | Open Brewery DB</title>
  <meta property="og:title" content="Breweries | Open Brewery DB" />
  <meta
    property="og:description"
    content="A worldwide open-source brewery dataset and API"
  />
</svelte:head>

<h1 class="text-3xl md:text-4xl font-bold my-4">List Breweries</h1>

<div class="mt-6">
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {#each Object.entries(mappings.countries) as [_, country]}
      <a
        class="block p-4 bg-white shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
        href="/breweries/{country.label}"
      >
        <div class="text-lg font-medium text-amber-600 hover:text-amber-900 transition-colors duration-200">
          {country.label}
        </div>
      </a>
    {/each}
  </div>
</div>
