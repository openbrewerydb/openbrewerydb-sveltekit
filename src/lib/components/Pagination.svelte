<script lang="ts">
  import type { Metadata } from '$lib/types';

  export let meta: Metadata;
  export let country: string;
  export let state: string | undefined = undefined;
  export let city: string | undefined = undefined;

  $: page = +meta.page;
</script>

<ul class="mt-4 text-sm flex gap-4">
  {#if page > 1}
    <li>
      <a
        class="px-4 py-2 border border-amber-300 rounded-md text-amber-700 hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 shadow-sm hover:shadow transition-shadow duration-200"
        href="/breweries/{country}{state ? `/${state}` : ''}{city
          ? `/${city}`
          : ''}/{page - 1}">Previous</a
      >
    </li>
  {/if}
  {#if page < +meta.total / +meta.per_page}
    <li>
      <a
        class="px-4 py-2 border border-amber-300 rounded-md text-amber-700 hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 shadow-sm hover:shadow transition-shadow duration-200"
        href="/breweries/{country}{state ? `/${state}` : ''}{city
          ? `/${city}`
          : ''}/{page + 1}">Next</a
      >
    </li>
  {/if}
</ul>
