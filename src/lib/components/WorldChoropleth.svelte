<script lang="ts">
  import { feature } from 'topojson-client';
  import world110m from 'world-atlas/countries-110m.json';
  import { geoPath, geoNaturalEarth1 } from 'd3-geo';

  type CountryDatum = { countryId: string; label: string; count: number };

  const { data } = $props<{
    data: {
      counts: CountryDatum[];
    };
  }>();

  const idMap: Record<string, number> = {
    'united-states': 840,
    ireland: 372,
    portugal: 620,
    austria: 40,
    singapore: 702,
    poland: 616,
    'south-korea': 410,
    germany: 276,
    italy: 380,
    japan: 392,
    sweden: 752,
    // UK constituent countries map to the United Kingdom feature (826)
    england: 826,
    scotland: 826,
  };

  const projection = geoNaturalEarth1().scale(165).translate([480, 250]);
  const path = geoPath(projection);

  const world = world110m as unknown as { type: string; objects: any };
  const countries = $derived(
    feature(world as any, world.objects.countries).features as any[]
  );

  const countById = $derived(() => {
    const m = new Map<number, number>();
    for (const c of data.counts) {
      const id = idMap[c.countryId];
      if (id && c.count > 0) m.set(id, (m.get(id) ?? 0) + c.count);
    }
    return m;
  });

  const maxCount = $derived(
    Array.from(countById().values()).reduce((m, v) => (v > m ? v : m), 0)
  );

  // NOTE: Logarithmic normalization so extreme values (e.g., US) don't dominate
  const logDenom = $derived(Math.log1p(maxCount));

  function colorFor(value: number | undefined) {
    if (!value || maxCount === 0) return '#e5e7eb';
    const t = Math.min(1, Math.max(0, Math.log1p(value) / (logDenom || 1)));
    if (t > 0.8) return '#b45309';
    if (t > 0.6) return '#d97706';
    if (t > 0.4) return '#f59e0b';
    if (t > 0.2) return '#fbbf24';
    return '#fcd34d';
  }

  // Extra diagnostics: surface unknown mappings and mapped samples
  $effect(() => {
    if (!data?.counts?.length) return;
    const unknown = data.counts.filter((c) => !idMap[c.countryId]).map((c) => c.countryId);
    if (unknown.length) {
      console.warn('[WorldChoropleth] unknown countryId(s) in data.counts:', Array.from(new Set(unknown)));
    }
    if (countById().size === 0) {
      const sample = data.counts.slice(0, 10).map((c) => ({ id: c.countryId, mapped: idMap[c.countryId], count: c.count }));
      console.debug('[WorldChoropleth] sample mapping preview:', sample);
    }
  });
</script>

<svg viewBox="0 0 960 500" class="w-full h-auto">
  <g>
    {#each countries as f}
      {@const fid = typeof f.id === 'string' ? parseInt(f.id, 10) : f.id}
      {@const value = countById().get(fid)}
      <path
        d={path(f)}
        fill={colorFor(value)}
        stroke="#ffffff"
        stroke-width="0.5"
      >
        <title>{value ? `${value.toLocaleString()} breweries` : ''}</title>
      </path>
    {/each}
  </g>
</svg>
