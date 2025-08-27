<script lang="ts">
  import { setTotalBreweries } from '$lib/stores/breweries.svelte';
  import WorldChoropleth from '$lib/components/WorldChoropleth.svelte';
  import SEO from '$lib/components/SEO.svelte';

  const { data } = $props<{
    data: {
      total: number;
      byType: { name: string; count: number; pct: number }[];
      byCountry: { countryId: string; label: string; count: number }[];
      unknownSubs?: { name: string; count: number }[];
      unknownTotal?: number;
      error?: string;
    };
  }>();

  $effect(() => {
    if (data?.total != null) setTotalBreweries(data.total);
  });

  const sortedTypes = $derived(
    [...data.byType].sort((a, b) => b.count - a.count)
  );
  const topCountries = $derived(
    [...data.byCountry].sort((a, b) => b.count - a.count).slice(0, 12)
  );
  const unknownSorted = $derived(
    [...(data.unknownSubs ?? [])].sort((a, b) => b.count - a.count)
  );
</script>

<SEO
  title="Dashboard"
  description="Brewery counts, types, and global distribution"
/>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
  {#if data?.error}
    <div class="rounded-md border border-red-300 bg-red-50 text-red-800 p-4">
      <p class="font-medium">{data.error}</p>
    </div>
  {:else}
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="rounded-lg border bg-white p-5 shadow-sm">
        <p class="text-sm text-neutral-500">Total Breweries</p>
        <p class="mt-1 text-3xl font-semibold tabular-nums">
          {data.total.toLocaleString()}
        </p>
      </div>
    </section>

    <section class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 rounded-lg border bg-white p-5 shadow-sm">
        <h2 class="text-base font-semibold">Type distribution</h2>
        <ul class="mt-4 space-y-3">
          {#each sortedTypes as t}
            <li class="flex items-center gap-3">
              <div class="w-28 shrink-0 text-sm text-neutral-700">{t.name}</div>
              <div class="flex-1">
                <div class="h-2 rounded bg-neutral-100">
                  <div
                    class="h-2 rounded bg-amber-500"
                    style={`width: ${Math.min(100, Math.max(0, t.pct)).toFixed(2)}%`}
                    aria-label={`{t.name} ${t.pct.toFixed(1)}%`}
                  ></div>
                </div>
              </div>
              <div
                class="w-24 text-right text-sm tabular-nums text-neutral-700"
              >
                {t.count.toLocaleString()}
                <span class="text-neutral-500">({t.pct.toFixed(1)}%)</span>
              </div>
            </li>
          {/each}
        </ul>
      </div>

      <div class="lg:col-span-2 rounded-lg border bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold">Breweries by country</h2>
          <p class="text-xs text-neutral-500">Choropleth map</p>
        </div>
        <div class="mt-4 aspect-[16/9] w-full">
          <WorldChoropleth data={{ counts: data.byCountry }} />
        </div>

        <div class="mt-4">
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="text-left text-neutral-500">
                  <th class="py-2 pr-3">Country</th>
                  <th class="py-2 pr-3">Breweries</th>
                  <th class="py-2 pr-3">Percent</th>
                </tr>
              </thead>
              <tbody>
                {#each topCountries as c}
                  <tr class="border-t">
                    <td class="py-2 pr-3">{c.label}</td>
                    <td class="py-2 pr-3 tabular-nums"
                      >{c.count.toLocaleString()}</td
                    >
                    <td class="py-2 pr-3 tabular-nums text-amber-700">
                      {data.total > 0
                        ? ((c.count / data.total) * 100).toFixed(1)
                        : '0.0'}%
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        {#if (data.unknownSubs?.length ?? 0) > 0}
          <div class="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4">
            <div class="flex items-baseline justify-between">
              <h3 class="text-base font-semibold text-amber-800">
                Unknown subdivisions
              </h3>
              <span class="text-sm text-amber-700">
                Total missing: <span class="font-semibold tabular-nums"
                  >{data.unknownTotal?.toLocaleString?.() ??
                    data.unknownTotal}</span
                >
              </span>
            </div>
            <p class="mt-1 text-sm text-amber-700">
              These appear to be <span class="font-medium"
                >state/province formatting issues</span
              > that didn’t map to a country. Try searching the raw subdivision to
              confirm and help us fix the mapping.
            </p>
            <div class="mt-3 overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="text-left text-amber-800">
                    <th class="py-2 pr-3">Subdivision</th>
                    <th class="py-2 pr-3">Breweries</th>
                  </tr>
                </thead>
                <tbody>
                  {#each unknownSorted as u}
                    <tr class="border-t border-amber-200">
                      <td class="py-2 pr-3">
                        <a
                          class="text-amber-700 hover:text-amber-900 underline decoration-amber-300 hover:decoration-amber-400"
                          href={`/breweries?query=${encodeURIComponent(u.name)}`}
                        >
                          {u.name}
                        </a>
                      </td>
                      <td class="py-2 pr-3 tabular-nums"
                        >{u.count.toLocaleString()}</td
                      >
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {/if}
      </div>
    </section>
  {/if}
</div>
