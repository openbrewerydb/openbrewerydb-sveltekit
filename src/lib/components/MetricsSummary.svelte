<script lang="ts">
  import type { MetricsData } from '$lib/types/metrics';
  import {
    formatBandwidth,
    formatRelativeTime,
    isDataStale,
  } from '$lib/utils/metrics';
  import { BarChart3, Activity, Users, HardDrive } from 'lucide-svelte';
  import MetricCard from './MetricCard.svelte';

  interface Props {
    metrics: MetricsData | null;
  }

  let { metrics }: Props = $props();

  const period = $derived(metrics?.periods.last_7_days);
</script>

<section class="max-w-6xl mx-auto px-4" aria-labelledby="metrics-title">
  <h2
    id="metrics-title"
    class="mt-6 tracking-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl"
  >
    Statistics
  </h2>
  <p
    class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-3 md:text-xl md:max-w-3xl"
  >
    Here's how many developers and breweries we serve every week.
  </p>

  {#if !metrics}
    <div class="text-center py-6">
      <p class="text-gray-500">Metrics unavailable</p>
    </div>
  {:else if metrics && period}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      <MetricCard
        icon={BarChart3}
        value={period.requests.total}
        label="Total Requests"
        subtitle="7 days"
      />

      <MetricCard
        icon={Activity}
        value={period.requests.api}
        label="API Requests"
        subtitle="7 days"
      />

      <MetricCard
        icon={Users}
        value={period.visits.total}
        label="Total Visits"
        subtitle="7 days"
      />

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <HardDrive class="w-8 h-8 text-amber-600" />
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">
          {formatBandwidth(period.bandwidth_tb)}
        </div>
        <div class="text-sm font-medium text-gray-700 mb-2">Bandwidth</div>
        <div class="text-xs text-gray-500">7 days</div>
      </div>
    </div>

    <div class="text-center mt-3 text-sm text-gray-500">
      {#if isDataStale(metrics.last_updated)}
        <p class="text-amber-600 font-medium mb-2">
          ⚠️ Metrics data may be outdated
        </p>
      {/if}
      <p>
        Last updated: {formatRelativeTime(metrics.last_updated)}
        <span class="mx-2">•</span>
        <a
          href="/stats"
          class="text-amber-600 hover:text-amber-700 font-medium underline decoration-amber-300 decoration-1 underline-offset-2"
        >
          View detailed statistics →
        </a>
      </p>
    </div>
  {/if}
</section>
