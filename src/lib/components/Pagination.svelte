<script lang="ts">
  export let page = 1;
  export let country: string;
  export let state: string | undefined = undefined;
  export let city: string | undefined = undefined;
</script>

<ul class="mt-4 text-sm flex gap-4">
  {#if page > 1}
    <li>
      <a
        href="/breweries/{country}{state ? `/${state}` : ''}{city
          ? `/${city}`
          : ''}/{+page - 1}">Previous</a
      >
    </li>
  {/if}
  <li>
    <a
      href="/breweries/{country}{state ? `/${state}` : ''}{city
        ? `/${city}`
        : ''}/{+page + 1}">Next</a
    >
  </li>
</ul>
