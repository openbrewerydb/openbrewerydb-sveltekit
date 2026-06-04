<script lang="ts">
  import SEO from '$lib/components/SEO.svelte';
  import { Globe, MapPin, Building2 } from 'lucide-svelte';

  let { data } = $props();

  let byCountry = $derived(data.byCountry || []);
  let byState = $derived(data.byState || []);
  let byType = $derived(data.byType || []);
  let error = $derived(data.error);
</script>

<SEO
  title="Browse Breweries by Country, State, and Type"
  description="Browse breweries from the Open Brewery DB dataset by country, state/province, and type."
/>

<div
  class="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50"
>
  <div class="container mx-auto px-4 py-12 max-w-7xl">
    <!-- Header -->
    <header class="mb-16 text-center">
      <h1
        class="text-5xl md:text-6xl font-serif font-bold text-amber-900 mb-4 tracking-tight"
      >
        Explore Breweries
      </h1>
      <p class="text-xl text-amber-700/80 max-w-2xl mx-auto font-light">
        Discover breweries around the world through our curated browsing
        experience
      </p>
    </header>

    {#if error}
      <div
        class="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-r-lg shadow-sm"
      >
        <p class="font-medium">Error: {error}</p>
      </div>
    {:else}
      <!-- Browse by Country -->
      <section class="mb-16">
        <div class="flex items-center gap-3 mb-8">
          <Globe class="w-8 h-8 text-amber-600" />
          <h2 class="text-3xl font-serif font-semibold text-amber-900">
            By Country
          </h2>
        </div>
        {#if byCountry.length > 0}
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {#each byCountry as item (item.name)}
              <a
                href={`/breweries/${encodeURIComponent(item.name)}`}
                class="group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-100"
              >
                <div
                  class="absolute inset-0 bg-linear-to-br from-amber-500/0 via-amber-500/0 to-orange-500/0 group-hover:from-amber-500/5 group-hover:via-orange-500/5 group-hover:to-yellow-500/5 transition-all duration-300"
                ></div>
                <div class="relative p-6">
                  <div class="flex items-start justify-between mb-3">
                    <h3
                      class="font-serif text-lg font-semibold text-amber-900 group-hover:text-amber-700 transition-colors"
                    >
                      {item.name}
                    </h3>
                    <Globe class="w-6 h-6 text-amber-500" />
                  </div>
                  <p class="text-sm text-amber-600/70 font-medium">
                    {item.count.toLocaleString()}
                    {item.count === 1 ? 'brewery' : 'breweries'}
                  </p>
                </div>
              </a>
            {/each}
          </div>
        {:else}
          <p class="text-amber-600/60 italic">
            No countries available to browse.
          </p>
        {/if}
      </section>

      <!-- Browse by State/Province -->
      <section class="mb-16">
        <div class="flex items-center gap-3 mb-8">
          <MapPin class="w-8 h-8 text-amber-600" />
          <h2 class="text-3xl font-serif font-semibold text-amber-900">
            By State/Province
          </h2>
        </div>
        {#if byState.length > 0}
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
          >
            {#each byState as item (item.name)}
              <a
                href={`/breweries/${encodeURIComponent(item.country)}/${encodeURIComponent(item.name)}`}
                class="group relative overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-amber-100"
              >
                <div class="relative p-4">
                  <h3
                    class="font-medium text-amber-900 group-hover:text-amber-700 transition-colors text-sm"
                  >
                    {item.name}
                  </h3>
                  <div class="flex items-center gap-1.5 mt-1">
                    <MapPin class="w-3 h-3 text-amber-500" />
                    <p class="text-xs text-amber-600/60">
                      {item.count.toLocaleString()}
                      {item.count === 1 ? ' brewery' : ' breweries'}
                    </p>
                  </div>
                </div>
              </a>
            {/each}
          </div>
        {:else}
          <p class="text-amber-600/60 italic">No states available to browse.</p>
        {/if}
      </section>

      <!-- Browse by Type -->
      <section>
        <div class="flex items-center gap-3 mb-8">
          <Building2 class="w-8 h-8 text-amber-600" />
          <h2 class="text-3xl font-serif font-semibold text-amber-900">
            By Type
          </h2>
        </div>
        {#if byType.length > 0}
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
          >
            {#each byType as item (item.name)}
              <a
                href={`/breweries?by_type=${encodeURIComponent(item.name)}`}
                class="group relative overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-amber-100"
              >
                <div class="relative p-4">
                  <h3
                    class="font-medium text-amber-900 group-hover:text-amber-700 transition-colors text-sm"
                  >
                    {item.name}
                  </h3>
                  <div class="flex items-center gap-1.5 mt-1">
                    <Building2 class="w-3 h-3 text-amber-500" />
                    <p class="text-xs text-amber-600/60">
                      {item.count.toLocaleString()}
                      {item.count === 1 ? ' brewery' : ' breweries'}
                    </p>
                  </div>
                </div>
              </a>
            {/each}
          </div>
        {:else}
          <p class="text-amber-600/60 italic">No types available to browse.</p>
        {/if}
      </section>
    {/if}
  </div>
</div>
