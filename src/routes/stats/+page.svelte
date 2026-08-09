<script lang="ts">
  import type { PageData } from './$types';
  import type { MetricsPayload } from '$lib/types/metrics';
  import {
    formatBytes,
    formatCompactNumber,
    formatRelativeTime,
    isStale,
  } from '$lib/utils/metrics';
  import { BarChart3, Activity, Users, HardDrive } from '@lucide/svelte';
  import MetricCard from '$lib/components/MetricCard.svelte';
  import MetricTrends from '$lib/components/MetricTrends.svelte';
  import SEO from '$lib/components/SEO.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const metrics = $derived(data.metrics as MetricsPayload | null);
  const error = $derived(data.error);

  const apiShare = $derived(
    metrics && metrics.totals.last_7_days.requests.total > 0
      ? metrics.totals.last_7_days.requests.api /
          metrics.totals.last_7_days.requests.total
      : 0
  );
</script>

<SEO title="Statistics" description="Real-time usage statistics for OpenBreweryDB." />

<div class="max-w-6xl mx-auto px-4 py-8">
  <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900">Statistics</h1>

  {#if error || !metrics}
    <div
      class="mt-6 text-center py-12 bg-white rounded-lg shadow-md border border-gray-200"
    >
      <p class="text-gray-700 text-lg">{error ?? 'Metrics unavailable'}</p>
    </div>
  {:else}
    <p class="mt-2 text-sm text-gray-600">
      Last updated: {formatRelativeTime(metrics.last_updated)}
      {#if isStale(metrics.last_updated)}
        <span class="text-amber-600 font-medium ml-2">
          — collector may be failing
        </span>
      {/if}
    </p>

    <section class="mt-8">
      <div class="bg-linear-to-br from-amber-50 to-amber-100 border border-amber-300 rounded-xl p-6 shadow-sm">
        <p class="text-sm font-medium text-amber-800 uppercase tracking-wide">
          Requests per day, average
        </p>
        <div class="mt-2 flex flex-wrap items-baseline gap-4">
          <span class="text-4xl font-extrabold text-amber-900">
            {formatCompactNumber(metrics.totals.requests_per_day_avg)}
          </span>
          <span class="text-amber-700">
            × 30 ≈ {formatCompactNumber(metrics.totals.requests_per_day_avg * 30)} monthly
          </span>
        </div>
        <p class="mt-2 text-amber-700">
          <span class="font-semibold">{Math.round(apiShare * 100)}%</span>
          of the last 7 days was API traffic.
        </p>
      </div>
    </section>

    <section class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        icon={BarChart3}
        value={metrics.totals.last_7_days.requests.total}
        label="Total Requests"
        subtitle="7 days"
      />
      <MetricCard
        icon={Activity}
        value={metrics.totals.last_7_days.requests.api}
        label="API Requests"
        subtitle="7 days"
      />
      <MetricCard
        icon={Users}
        value={metrics.totals.last_7_days.visits.total}
        label="Total Visits"
        subtitle="7 days"
      />
      <MetricCard
        icon={HardDrive}
        value={metrics.totals.last_7_days.bandwidth_bytes}
        label="Bandwidth"
        subtitle="7 days"
        format={formatBytes}
      />
    </section>

    <section class="mt-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Traffic trends</h2>
      <MetricTrends {metrics} />
    </section>

    <section class="mt-12 max-w-3xl text-sm text-gray-600 space-y-2">
      <p>
        All times are UTC. The hourly window shows the most recent {metrics.hourly.window_hours}
        hours; the daily chart shows {metrics.daily.window_days} complete days, with today omitted
        to avoid a misleading partial-day drop.
      </p>
      <p>
        Data is refreshed hourly from Cloudflare traffic logs. If the "last updated" time is more
        than 90 minutes old, the collector is behind and values may be stale.
      </p>
      <p>
        Metrics are collected by the
        <a
          href="https://github.com/openbrewerydb/openbrewerydb-metrics"
          class="text-amber-700 underline decoration-amber-300 hover:text-amber-800"
          rel="noopener noreferrer"
          target="_blank">openbrewerydb-metrics</a
        > worker.
      </p>
    </section>
  {/if}
</div>
