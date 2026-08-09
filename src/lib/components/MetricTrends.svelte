<script lang="ts">
  import { AreaChart, BarChart } from 'layerchart';
  import { SvelteSet } from 'svelte/reactivity';
  import type { MetricsPayload } from '$lib/types/metrics';
  import { toHourly, toDaily } from '$lib/utils/metrics';
  import { METRIC_COLORS, METRIC_LABELS } from '$lib/utils/chart-theme';
  import type { MetricSeriesKey } from '$lib/utils/chart-theme';

  interface Props {
    metrics: MetricsPayload | null;
  }

  let { metrics }: Props = $props();

  type Range = '24h' | '7d';
  let range = $state<Range>('24h');

  let hidden = new SvelteSet<MetricSeriesKey>();

  const requestKeys = $derived(
    (['api', 'www', 'other'] as MetricSeriesKey[]).filter(
      (k) => !hidden.has(k)
    )
  );

  const hourlyBuckets = $derived(
    metrics ? toHourly(metrics.hourly.samples) : []
  );
  const visibleHourly = $derived(
    range === '24h' ? hourlyBuckets.slice(-24) : hourlyBuckets
  );

  const dailyBuckets = $derived(
    metrics ? toDaily(metrics.daily.samples) : []
  );

  const requestSeries = $derived(
    requestKeys.map((key) => ({
      key,
      label: METRIC_LABELS[key],
      color: METRIC_COLORS[key],
    }))
  );

  const visitKeys = $derived(
    (['www', 'other'] as MetricSeriesKey[]).filter((k) => !hidden.has(k))
  );

  const visitSeries = $derived(
    visitKeys.map((key) => ({
      key: key === 'www' ? 'visitsWww' : 'visitsOther',
      label: METRIC_LABELS[key],
      color: METRIC_COLORS[key],
    }))
  );

  function toggleSeries(key: MetricSeriesKey) {
    if (hidden.has(key)) {
      hidden.delete(key);
    } else {
      hidden.add(key);
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
          series={requestSeries}
          seriesLayout="stack"
          props={{ tooltip: { root: { variant: 'none', classes: { container: 'bg-white border border-amber-300 rounded-lg shadow-md p-2 text-sm text-gray-800' } } } }}
        />
      </div>

      <div class="flex flex-wrap items-center gap-3" role="group" aria-label="Series">
        {#each (['api', 'www', 'other'] as MetricSeriesKey[]) as key (key)}
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-opacity {hidden.has(
              key
            )
              ? 'opacity-40'
              : 'hover:bg-gray-50'}"
            style="border-color: {METRIC_COLORS[key]};"
            onclick={() => toggleSeries(key)}
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
          series={requestSeries}
          seriesLayout="stack"
          props={{ tooltip: { root: { variant: 'none', classes: { container: 'bg-white border border-amber-300 rounded-lg shadow-md p-2 text-sm text-gray-800' } } } }}
        />
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
    </section>
  </div>
{/if}
