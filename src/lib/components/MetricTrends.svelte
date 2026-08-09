<script lang="ts">
  import { AreaChart, BarChart } from 'layerchart';
  import { SvelteSet } from 'svelte/reactivity';
  import type { MetricsPayload } from '$lib/types/metrics';
  import { toHourly, toDaily, formatBytes } from '$lib/utils/metrics';
  import { METRIC_COLORS, METRIC_LABELS } from '$lib/utils/chart-theme';
  import type { MetricSeriesKey } from '$lib/utils/chart-theme';

  interface Props {
    metrics: MetricsPayload | null;
  }

  let { metrics }: Props = $props();

  type Range = '24h' | '7d';
  let range = $state<Range>('24h');

  let hourlyHidden = new SvelteSet<MetricSeriesKey>();
  let dailyHidden = new SvelteSet<MetricSeriesKey>();
  let visitHidden = new SvelteSet<MetricSeriesKey>();

  const hourlyBuckets = $derived(
    metrics ? toHourly(metrics.hourly.samples) : []
  );
  const visibleHourly = $derived(
    range === '24h' ? hourlyBuckets.slice(-24) : hourlyBuckets
  );

  const dailyBuckets = $derived(
    metrics ? toDaily(metrics.daily.samples) : []
  );

  const requestKeys = $derived(
    (['api', 'www', 'other'] as MetricSeriesKey[]).filter(
      (k) => !hourlyHidden.has(k)
    )
  );

  const hourlySeries = $derived(
    requestKeys.map((key) => ({
      key,
      label: METRIC_LABELS[key],
      color: METRIC_COLORS[key],
    }))
  );

  const dailyKeys = $derived(
    (['api', 'www', 'other'] as MetricSeriesKey[]).filter(
      (k) => !dailyHidden.has(k)
    )
  );

  const dailySeries = $derived(
    dailyKeys.map((key) => ({
      key,
      label: METRIC_LABELS[key],
      color: METRIC_COLORS[key],
    }))
  );

  const visitKeys = $derived(
    (['www', 'other'] as MetricSeriesKey[]).filter((k) => !visitHidden.has(k))
  );

  const visitSeries = $derived(
    visitKeys.map((key) => ({
      key: key === 'www' ? 'visitsWww' : 'visitsOther',
      label: METRIC_LABELS[key],
      color: METRIC_COLORS[key],
    }))
  );

  function toggle(set: SvelteSet<MetricSeriesKey>, key: MetricSeriesKey) {
    if (set.has(key)) {
      set.delete(key);
    } else {
      set.add(key);
    }
  }
</script>

{#if metrics}
  <div class="space-y-12">
    <section class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h3 class="text-xl font-semibold text-amber-700">Hourly requests</h3>
        <div
          class="inline-flex rounded-lg border border-gray-200 bg-white shadow-sm"
          role="group"
          aria-label="Hourly range"
        >
          <button
            type="button"
            class="px-3 py-1.5 text-sm font-medium rounded-l-lg {range === '24h'
              ? 'bg-amber-600 text-white'
              : 'text-gray-700 hover:bg-gray-50'}"
            onclick={() => (range = '24h')}
          >
            24h
          </button>
          <button
            type="button"
            class="px-3 py-1.5 text-sm font-medium rounded-r-lg {range === '7d'
              ? 'bg-amber-600 text-white'
              : 'text-gray-700 hover:bg-gray-50'}"
            onclick={() => (range = '7d')}
          >
            7d
          </button>
        </div>
      </div>

      <div class="h-72 w-full">
        <AreaChart
          data={visibleHourly}
          x="date"
          yBaseline={0}
          series={hourlySeries}
          seriesLayout="stack"
          props={{ tooltip: { root: { variant: 'none', classes: { container: 'bg-white border border-amber-300 rounded-lg shadow-md p-2 text-sm text-gray-800' } } } }}
        />
      </div>

      <p class="text-xs text-gray-500">
        Stacked area chart of hourly request counts split by origin: API (api.openbrewerydb.org),
        Website (www.openbrewerydb.org), and Other (any other host or direct). The 24h view shows the
        most recent 24 hours; 7d shows the full {metrics.hourly.window_hours}-hour window. Use the
        legend buttons to toggle series visibility. All times are UTC.
      </p>

      <div class="flex flex-wrap items-center gap-3" role="group" aria-label="Series">
        {#each (['api', 'www', 'other'] as MetricSeriesKey[]) as key (key)}
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-opacity {hourlyHidden.has(
              key
            )
              ? 'opacity-40'
              : 'hover:bg-gray-50'}"
            style="border-color: {METRIC_COLORS[key]};"
            onclick={() => toggle(hourlyHidden, key)}
          >
            <span
              class="h-3 w-3 rounded-full"
              style="background-color: {METRIC_COLORS[key]};"
            ></span>
            {METRIC_LABELS[key]}
          </button>
        {/each}
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-xl font-semibold text-amber-700">Daily sustained scale</h3>
      <p class="text-sm text-gray-600">
        Last {metrics.daily.window_days} complete days, UTC. Today is not yet shown.
      </p>
      <div class="h-72 w-full">
        <BarChart
          data={dailyBuckets}
          x="date"
          yBaseline={0}
          series={dailySeries}
          seriesLayout="stack"
          props={{ tooltip: { root: { variant: 'none', classes: { container: 'bg-white border border-amber-300 rounded-lg shadow-md p-2 text-sm text-gray-800' } } } }}
        />
      </div>

      <p class="text-xs text-gray-500">
        Stacked bar chart of daily request totals over the last {metrics.daily.window_days} complete
        UTC days. Today is excluded to avoid a misleading partial-day bar. Each bar is segmented by
        the same API / Website / Other breakdown as the hourly chart above.
      </p>

      <div class="flex flex-wrap items-center gap-3" role="group" aria-label="Daily series">
        {#each (['api', 'www', 'other'] as MetricSeriesKey[]) as key (key)}
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-opacity {dailyHidden.has(
              key
            )
              ? 'opacity-40'
              : 'hover:bg-gray-50'}"
            style="border-color: {METRIC_COLORS[key]};"
            onclick={() => toggle(dailyHidden, key)}
          >
            <span
              class="h-3 w-3 rounded-full"
              style="background-color: {METRIC_COLORS[key]};"
            ></span>
            {METRIC_LABELS[key]}
          </button>
        {/each}
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-xl font-semibold text-amber-700">Visits</h3>
      <p class="text-sm text-gray-600">
        API visits are omitted — visits are referrer-derived and API clients do not send a referrer.
      </p>
      <div class="h-72 w-full">
        <AreaChart
          data={visibleHourly}
          x="date"
          yBaseline={0}
          series={visitSeries}
          seriesLayout="stack"
          props={{ tooltip: { root: { variant: 'none', classes: { container: 'bg-white border border-amber-300 rounded-lg shadow-md p-2 text-sm text-gray-800' } } } }}
        />
      </div>

      <p class="text-xs text-gray-500">
        Visits are derived from the Referer header and attributed to www (www.openbrewerydb.org) or
        Other (any other referrer). API traffic is excluded because API clients typically do not send
        a Referer header. The range toggle (24h / 7d) mirrors the hourly requests chart above.
      </p>

      <div class="flex flex-wrap items-center gap-3" role="group" aria-label="Visit series">
        {#each (['www', 'other'] as MetricSeriesKey[]) as key (key)}
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-opacity {visitHidden.has(
              key
            )
              ? 'opacity-40'
              : 'hover:bg-gray-50'}"
            style="border-color: {METRIC_COLORS[key]};"
            onclick={() => toggle(visitHidden, key)}
          >
            <span
              class="h-3 w-3 rounded-full"
              style="background-color: {METRIC_COLORS[key]};"
            ></span>
            {METRIC_LABELS[key]}
          </button>
        {/each}
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-xl font-semibold text-amber-700">Bandwidth</h3>
      <div class="h-72 w-full">
        <AreaChart
          data={visibleHourly}
          x="date"
          yBaseline={0}
          series={[
            {
              key: 'bandwidth_bytes',
              label: 'Bandwidth',
              color: METRIC_COLORS.www,
            },
          ]}
          props={{ tooltip: { root: { variant: 'none', classes: { container: 'bg-white border border-amber-300 rounded-lg shadow-md p-2 text-sm text-gray-800' } } } }}
        />
      </div>

      <p class="text-xs text-gray-500">
        Total bandwidth served per hour across all origins (API, website, and other). This includes
        response bodies, headers, and overhead. Values are shown in bytes; the 7-day total is
        {formatBytes(metrics.totals.last_7_days.bandwidth_bytes)}. The range toggle mirrors the
        hourly requests chart above.
      </p>
    </section>
  </div>
{/if}
