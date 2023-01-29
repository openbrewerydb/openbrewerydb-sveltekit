<script lang="ts">
  import { mappings } from '$lib/utils';
</script>

<h1 class="text-4xl my-4">List Breweries</h1>

<ul class="list-disc pl-6">
  {#each Object.entries(mappings.countries) as [id, country]}
    <li>
      <a
        class="underline text-gray-900 hover:text-amber-600"
        href="/breweries/{country.label}">{country.label}</a
      >
    </li>
  {/each}
</ul>
