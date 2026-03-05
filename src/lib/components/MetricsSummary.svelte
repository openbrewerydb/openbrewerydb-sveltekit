<script lang="ts">
  import { onMount } from 'svelte';
  import type { MetricsData } from '$lib/types/metrics';
  import {
    formatNumber,
    formatBandwidth,
    formatRelativeTime,
    isDataStale,
  } from '$lib/utils/metrics';
  import { BarChart3, Activity, Users, HardDrive } from 'lucide-svelte';

  let metricsData: MetricsData | null = $state(null);
  let loading: boolean = $state(true);
  let error: string | null = $state(null);

  onMount(async () => {
    try {
      const response = await fetch('/api/metrics');
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      metricsData = await response.json();
      loading = false;
    } catch (err) {
      console.error('Error loading metrics:', err);
      error = 'Unable to load metrics at this time';
      loading = false;
    }
  });

  const stats = $derived(() => {
    if (!metricsData) return null;
    const period = metricsData.periods.last_7_days;
    return [
      {
        label: 'Total Requests',
        value: formatNumber(period.requests.total),
        subtitle: '7 days',
        icon: BarChart3,
        color: 'amber',
      },
      {
        label: 'API Requests',
        value: formatNumber(period.requests.api),
        subtitle: '7 days',
        icon: Activity,
        color: 'amber',
      },
      {
        label: 'Total Visits',
        value: formatNumber(period.visits.total),
        subtitle: '7 days',
        icon: Users,
        color: 'amber',
      },
      {
        label: 'Bandwidth',
        value: formatBandwidth(period.bandwidth_tb),
        subtitle: '7 days',
        icon: HardDrive,
        color: 'amber',
      },
    ];
  });
</script>

<section class="mt-16 max-w-6xl mx-auto px-4" aria-labelledby="metrics-title">
  <h2
    id="metrics-title"
    class="text-3xl font-extrabold text-gray-900 text-center mb-4"
  >
    Transparency & Statistics
  </h2>
  <p class="text-center text-base text-gray-500 max-w-2xl mx-auto mb-8">
    Open data deserves open metrics. Here's how many developers and breweries we
    serve every week.
  </p>

  {#if loading}
    <div class="text-center py-12">
      <p class="text-gray-500">Loading metrics...</p>
    </div>
  {:else if error}
    <div class="text-center py-12">
      <p class="text-gray-500">{error}</p>
    </div>
  {:else if metricsData && stats()}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {#each stats() as stat}
        {@const Icon = stat.icon}
        <div
          class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
        >
          <div class="flex items-center justify-between mb-3">
            <Icon class="w-8 h-8 text-amber-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">
            {stat.value}
          </div>
          <div class="text-sm font-medium text-gray-700 mb-1">
            {stat.label}
          </div>
          <div class="text-xs text-gray-500">
            {stat.subtitle}
          </div>
        </div>
      {/each}
    </div>

    <div class="text-center text-sm text-gray-500">
      {#if isDataStale(metricsData.last_updated)}
        <p class="text-amber-600 font-medium mb-2">
          ⚠️ Metrics data may be outdated
        </p>
      {/if}
      <p>
        Last updated: {formatRelativeTime(metricsData.last_updated)}
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
