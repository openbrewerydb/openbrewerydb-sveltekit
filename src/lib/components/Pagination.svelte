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
        href="/breweries/{country}{state ? `/${state}` : ''}{city
          ? `/${city}`
          : ''}/{page - 1}">Previous</a
      >
    </li>
  {/if}
  {#if page < +meta.total / +meta.per_page}
    <li>
      <a
        href="/breweries/{country}{state ? `/${state}` : ''}{city
          ? `/${city}`
          : ''}/{page + 1}">Next</a
      >
    </li>
  {/if}
</ul>
