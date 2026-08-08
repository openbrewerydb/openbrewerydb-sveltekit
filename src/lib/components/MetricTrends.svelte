<script lang="ts">
  import { AreaChart } from 'layerchart';
  import type { MetricsHistory } from '$lib/types/metrics';
  import { normalizeHistory } from '$lib/utils/metrics';

  interface Props {
    history: MetricsHistory | null;
  }

  let { history }: Props = $props();

  const buckets = $derived(normalizeHistory(history));

  const hasData = $derived(
    buckets.length > 0 && buckets.some((b) => b.requests !== null)
  );

  const xDomain = $derived(
    buckets.length > 0
      ? [buckets[0].timestamp, buckets[buckets.length - 1].timestamp]
      : undefined
  );

  // Max stacked totals for y-axis (anchored at 0).
  const maxRequests = $derived(
    Math.max(
      0,
      ...buckets.map(
        (b) =>
          (b.requests?.api ?? 0) +
          (b.requests?.www ?? 0) +
          (b.requests?.other ?? 0)
      )
    )
  );
  const maxVisits = $derived(
    Math.max(
      0,
      ...buckets.map((b) => (b.visits?.www ?? 0) + (b.visits?.other ?? 0))
    )
  );
  const maxBandwidth = $derived(
    Math.max(0, ...buckets.map((b) => b.bandwidth_tb ?? 0))
  );

  const definedRequests = (d: (typeof buckets)[number]) => d.requests !== null;
  const definedVisits = (d: (typeof buckets)[number]) => d.visits !== null;
  const definedBandwidth = (d: (typeof buckets)[number]) =>
    d.bandwidth_tb !== null;

  const requestsSeries = [
    {
      key: 'api',
      label: 'API',
      value: (d: (typeof buckets)[number]) => d.requests?.api ?? 0,
      color: '#d97706',
      props: { defined: definedRequests },
    },
    {
      key: 'www',
      label: 'Website',
      value: (d: (typeof buckets)[number]) => d.requests?.www ?? 0,
      color: '#f59e0b',
      props: { defined: definedRequests },
    },
    {
      key: 'other',
      label: 'Other',
      value: (d: (typeof buckets)[number]) => d.requests?.other ?? 0,
      color: '#fbbf24',
      props: { defined: definedRequests },
    },
  ];

  const visitsSeries = [
    {
      key: 'www',
      label: 'Website',
      value: (d: (typeof buckets)[number]) => d.visits?.www ?? 0,
      color: '#f59e0b',
      props: { defined: definedVisits },
    },
    {
      key: 'other',
      label: 'Other',
      value: (d: (typeof buckets)[number]) => d.visits?.other ?? 0,
      color: '#fbbf24',
      props: { defined: definedVisits },
    },
  ];

  const bandwidthSeries = [
    {
      key: 'bandwidth',
      label: 'Bandwidth',
      value: (d: (typeof buckets)[number]) => d.bandwidth_tb ?? 0,
      color: '#d97706',
      props: { defined: definedBandwidth },
    },
  ];

  const xAccessor = (d: (typeof buckets)[number]) => d.timestamp;
</script>

<section class="mb-16">
  <div class="flex items-center justify-center mb-6">
    <h2 class="text-3xl font-bold text-gray-900">Metric Trends</h2>
  </div>

  {#if !hasData}
    <div class="bg-white rounded-lg shadow-md p-8 border border-gray-200 text-center">
      <p class="text-gray-600">
        Trends will appear as hourly data is collected.
      </p>
    </div>
  {:else}
    <div class="space-y-8">
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Requests per hour</h3>
        <div class="h-64">
          <AreaChart
            ssr
            data={buckets}
            x={xAccessor}
            xDomain={xDomain}
            yDomain={[0, maxRequests]}
            series={requestsSeries}
            seriesLayout="stack"
          />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Visits per hour</h3>
        <div class="h-64">
          <AreaChart
            ssr
            data={buckets}
            x={xAccessor}
            xDomain={xDomain}
            yDomain={[0, maxVisits]}
            series={visitsSeries}
            seriesLayout="stack"
          />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Bandwidth per hour
        </h3>
        <div class="h-64">
          <AreaChart
            ssr
            data={buckets}
            x={xAccessor}
            xDomain={xDomain}
            yDomain={[0, maxBandwidth]}
            series={bandwidthSeries}
          />
        </div>
      </div>
    </div>
  {/if}
</section>
