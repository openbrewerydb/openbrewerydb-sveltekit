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
  <meta name="twitter:title" content="Breweries | Open Brewery DB" />
  <meta
    name="twitter:description"
    content="A worldwide open-source brewery dataset and API"
  />
</svelte:head>

<h1 class="text-4xl my-4">List Breweries</h1>

<ul class="list-disc pl-6">
  {#each Object.entries(mappings.countries) as [id, country]}
    <li>
      <a
        class="text-amber-600 hover:text-amber-900"
        href="/breweries/{country.label}">{country.label}</a
      >
    </li>
  {/each}
</ul>
