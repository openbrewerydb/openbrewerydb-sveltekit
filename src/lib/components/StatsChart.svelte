<script lang="ts">
  import { Chart, Bars, Area, Axis, Svg, Tooltip, Highlight } from 'layerchart';
  import { scaleBand } from 'd3-scale';

  let loading = $state(true);
  let error = $state<string | null>(null);
  let data = $state<Array<{ type: string; count: number }>>([]);
  let total = $state<number>(0);
  let mounted = $state(false);
  let container = $state<HTMLDivElement | null>(null);

  type Item = { brewery_type: string; value: number };

  function titleCase(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  function formatCount(n: number) {
    return new Intl.NumberFormat().format(n);
  }

  const normalized: Item[] = $derived(
    [...data]
      .filter(
        (d) =>
          d && d.type && d.count != null && Number.isFinite(Number(d.count))
      )
      .map((d) => ({
        brewery_type: titleCase(String(d.type)),
        value: Number(d.count),
      }))
      .sort((a, b) => b.value - a.value)
  );

  const chartData: Item[] = $derived(normalized);

  // For Area + bisect-x, use numeric x (index) so bisector aligns to points
  type ItemWithIndex = Item & { i: number };
  const withIndex: ItemWithIndex[] = $derived(
    chartData.map((d, i) => ({ ...d, i }))
  );

  $effect(() => {
    console.log('chartData', withIndex);
  });

  $effect(() => {
    if (typeof window === 'undefined') return;
    mounted = true;
    (async () => {
      try {
        loading = true;
        error = null;
        const res = await fetch('/api/stats', {
          headers: { accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`Failed to load stats (${res.status})`);
        const json: {
          data: Array<{ type: string; count: number }>;
          total: number;
        } = await res.json();
        data = json.data;
        total = json.total;
      } catch (e) {
        error = (e as Error).message;
      } finally {
        loading = false;
      }
    })();
  });
</script>

<div
  class="w-full relative rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
>
  <div class="mb-3 flex items-baseline justify-between gap-2">
    <h2 class="text-base font-semibold">Breweries by type</h2>
    {#if total}
      <p class="text-xs text-neutral-500">
        Sample size: {formatCount(total)}
      </p>
    {/if}
  </div>

  {#if loading}
    <div class="py-10 text-center text-sm text-neutral-500">Loading…</div>
  {:else if error}
    <div class="py-10 text-center text-sm text-red-500">{error}</div>
  {:else if !chartData.length}
    <div class="py-10 text-center text-sm text-neutral-500">No data</div>
  {:else}
    <div class="h-[360px] w-full relative" bind:this={container}>
      {#if mounted && container && container.clientWidth > 0}
        {#key `${chartData.length}-${total}`}
          <Chart
            data={withIndex}
            xScale={scaleBand().padding(0.1)}
            x="i"
            y="value"
            yDomain={[0, null]}
            yNice
            tooltip={{ mode: 'bisect-x' }}
            padding={{ left: 20, bottom: 72, top: 0, right: 0 }}
          >
            <Svg>
              <Axis placement="left" grid rule class="stroke-neutral-200" />
              <Axis
                placement="bottom"
                rule
                tickLabelProps={{
                  rotate: 315,
                  textAnchor: 'end',
                }}
                format={(i) => chartData[i]?.brewery_type ?? ''}
              />
              <Bars
                class="fill-amber-500 hover:fill-amber-600 stroke-black"
                strokeWidth={1}
              />
              <Highlight lines />
            </Svg>
            <Tooltip.Root let:data class="bg-white p-1 border border-neutral-200 rounded shadow-sm">
              <Tooltip.Header>{data.brewery_type}</Tooltip.Header>
              <Tooltip.List>
                <Tooltip.Item
                  label="Breweries"
                  value={formatCount(data.value)}
                />
              </Tooltip.List>
            </Tooltip.Root>
          </Chart>
        {/key}
      {/if}
    </div>
  {/if}
</div>
