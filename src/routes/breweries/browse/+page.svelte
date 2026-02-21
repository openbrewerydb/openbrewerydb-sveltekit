<script lang="ts">
  import SEO from '$lib/components/SEO.svelte';

  let { data } = $props();

  let byState = $derived(data.byState || []);
  let byType = $derived(data.byType || []);
  let error = $derived(data.error);
</script>

<SEO
  title="Browse Breweries by State and Type"
  description="Browse breweries from the Open Brewery DB dataset by state/province and type."
/>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Browse Breweries</h1>

  {#if error}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6"
    >
      <p>Error: {error}</p>
    </div>
  {:else}
    <!-- Browse by State/Province -->
    <section>
      <h2 class="text-2xl font-semibold mb-4 border-b pb-2">
        By State/Province
      </h2>
      {#if byState.length > 0}
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {#each byState as item (item.name)}
            <a
              href={`/breweries?query=${encodeURIComponent(item.name)}`}
              class="block p-4 rounded-lg shadow-md bg-white hover:bg-amber-100 transition-colors"
            >
              <p class="font-semibold text-amber-800">{item.name}</p>
              <p class="text-sm text-gray-600">{item.count} breweries</p>
            </a>
          {/each}
        </div>
      {:else}
        <p class="text-gray-500 mt-4">No states available to browse.</p>
      {/if}
    </section>

    <!-- Browse by Type -->
    <section class="mt-12">
      <h2 class="text-2xl font-semibold mb-4 border-b pb-2">By Type</h2>
      {#if byType.length > 0}
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {#each byType as item (item.name)}
            <a
              href={`/breweries/?query=${encodeURIComponent(item.name)}`}
              class="block p-4 rounded-lg shadow-md bg-white hover:bg-amber-100 transition-colors"
            >
              <p class="font-semibold text-amber-800">{item.name}</p>
              <p class="text-sm text-gray-600">{item.count} breweries</p>
            </a>
          {/each}
        </div>
      {:else}
        <p class="text-gray-500 mt-4">No types available to browse.</p>
      {/if}
    </section>
  {/if}
</div>
