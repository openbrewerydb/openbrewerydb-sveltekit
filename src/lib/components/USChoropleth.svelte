<script lang="ts">
  import { feature } from 'topojson-client';
  import { geoAlbersUsa, type GeoProjection } from 'd3-geo';
  import { schemeBlues } from 'd3-scale-chromatic';
  import { scaleQuantile } from 'd3-scale';
  import { Chart, GeoPath, Legend, Svg, Tooltip } from 'layerchart';
  import states10m from 'us-atlas/states-10m.json';

  // Svelte 5 runes
  let loading = $state(true);
  let error = $state<string | null>(null);
  let mounted = $state(false);

  // Layout / sizing
  let container: HTMLDivElement | null = $state(null);
  let height = $state(420);

  // Data
  type StateFeature = GeoJSON.Feature<
    GeoJSON.Geometry,
    { name?: string; id?: string }
  >;
  let states: StateFeature[] = $state([]);
  let values = $state<Record<string, number>>({}); // key by state name

  // LayerChart expects a projection factory
  const projection = () => geoAlbersUsa() as unknown as GeoProjection;

  const fmt = (n: number) => new Intl.NumberFormat().format(n);

  // Fetch data on client
  $effect(() => {
    if (typeof window === 'undefined') return;
    mounted = true;
    (async () => {
      try {
        loading = true;
        error = null;

        const geo = feature(
          states10m as any,
          (states10m as any).objects.states
        ) as unknown as {
          type: 'FeatureCollection';
          features: StateFeature[];
        };
        states = geo.features;

        const metaRes = await fetch(
          'https://api.openbrewerydb.org/v1/breweries/meta?by_country=United_States',
          { headers: { accept: 'application/json' } }
        );
        if (!metaRes.ok)
          throw new Error(`Failed to load brewery meta (${metaRes.status})`);
        const meta = await metaRes.json();
        const by_state: Record<string, number> = meta?.by_state ?? {};

        console.log('by_state', by_state);

        values = by_state;
      } catch (e) {
        console.error('USChoropleth fetch error:', e);
        error = (e as Error).message;
      } finally {
        loading = false;
      }
    })();
  });

  type Entry = { f: StateFeature; name: string; v: number };
  const entries = $derived(
    states.map((f) => {
      const name = (f.properties?.name as string) ?? '';
      const v = values[name] ?? 0;
      return { f, name, v } satisfies Entry;
    }) as Entry[]
  );

  function ariaLabel(entry: Entry): string {
    return `${entry.name}: ${fmt(entry.v)} breweries`;
  }

  // Color scale for LayerChart (must be an actual D3 scale, not a function)
  const colorScale = $derived(
    scaleQuantile<string, string>()
      .domain(entries.map((d) => d.v))
      .range(schemeBlues[9])
  );

  const maxVal: number = $derived(
    entries.length ? Math.max(...entries.map((e) => e.v)) : 0
  );
</script>

<div
  class="w-full relative rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
>
  <div class="mb-3 flex items-baseline justify-between gap-2">
    <h2 class="text-base font-semibold">Breweries by state (US)</h2>
    {#if maxVal}
      <p class="text-xs text-neutral-500">Max: {fmt(maxVal)}</p>
    {/if}
  </div>

  {#if loading}
    <div class="py-10 text-center text-sm text-neutral-500">Loading…</div>
  {:else if error}
    <div class="py-10 text-center text-sm text-red-500">{error}</div>
  {:else if !entries.length}
    <div class="py-10 text-center text-sm text-neutral-500">No data</div>
  {:else}
    <div class="relative h-[420px]" bind:this={container}>
      <Chart
        geo={{
          projection,
          fitGeojson: { type: 'FeatureCollection', features: states } as any,
        }}
        padding={{ top: 8, right: 8, bottom: 8, left: 8 }}
        tooltip={{ raiseTarget: true }}
        let:tooltip
      >
        <Svg>
          <g>
            {#each entries as e (e.name)}
              <GeoPath
                geojson={e.f}
                fill={colorScale(e.v)}
                class="stroke-white"
                {tooltip}
                aria-label={ariaLabel(e)}
              />
            {/each}
          </g>
        </Svg>

        <Legend
          scale={colorScale}
          title="Breweries"
          class="absolute bg-white/80 px-2 py-1 rounded m-1 text-xs"
        />

        <Tooltip.Root
          let:data
          class="bg-white p-1 border border-neutral-200 rounded shadow-sm"
        >
          <Tooltip.Header>{data.properties.name}</Tooltip.Header>
          <Tooltip.List>
            <Tooltip.Item
              label="Breweries"
              value={values[data.properties.name] ?? 0}
              format="integer"
            />
          </Tooltip.List>
        </Tooltip.Root>
      </Chart>
    </div>
  {/if}
</div>
