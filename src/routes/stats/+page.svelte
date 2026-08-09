<script lang="ts">
  import type { PageData } from './$types';
  import type { MetricsPayload } from '$lib/types/metrics';
  import {
    formatBytes,
    formatCompactNumber,
    formatAbsoluteTime,
    formatRelativeTime,
    isStale,
  } from '$lib/utils/metrics';
  import { API_URL } from '$lib/utils';
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
  const sourceUrl = $derived(data.sourceUrl);

  const apiShare = $derived(
    metrics && metrics.totals.last_7_days.requests.total > 0
      ? metrics.totals.last_7_days.requests.api /
          metrics.totals.last_7_days.requests.total
      : 0
  );

  // ponytail: static repo/site URLs declared locally — no existing constants to reuse,
  // and a shared "EXTERNAL_LINKS" module would be speculative for one page. Upgrade path:
  // extract to $lib/links.ts if a second page needs them.
  const DATASET_REPO_URL = 'https://github.com/openbrewerydb/openbrewerydb';
  const METRICS_REPO_URL = 'https://github.com/openbrewerydb/openbrewerydb-metrics';
  const DOCS_URL = 'https://openbrewerydb.org/documentation';
</script>

<SEO title="Statistics" description="Real-time usage statistics for OpenBreweryDB." />

<div class="max-w-6xl mx-auto">
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

    <section class="mt-8">
      <p class="font-serif text-sm text-gray-500 mb-3">
        Table 1. Summary metrics, last 7 days (UTC).
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
    </section>

    <section class="mt-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Traffic trends</h2>
      <MetricTrends {metrics} {sourceUrl} />
    </section>

    <section class="mt-12 max-w-3xl">
      <h2 class="font-serif text-xl font-bold text-gray-900 mb-4">
        Data sources
      </h2>
      <div class="prose prose-sm prose-amber max-w-none">
        <p>
          The figures above are derived from a single live source feed, collected hourly
          from Cloudflare traffic logs by an open-source worker. The raw JSON payload
          backing every number on this page is published openly:
        </p>
        <ul>
          <li>
            <strong>Source data (live JSON).</strong>
            <a
              href={sourceUrl}
              class="underline decoration-amber-300 hover:text-amber-800"
              rel="noopener noreferrer"
              target="_blank">{sourceUrl}</a
            >
          </li>
          <li>
            <strong>Metrics collector.</strong>
            <a
              href={METRICS_REPO_URL}
              class="underline decoration-amber-300 hover:text-amber-800"
              rel="noopener noreferrer"
              target="_blank">openbrewerydb-metrics</a
            >
            — the Cloudflare Worker that aggregates the logs into the payload above.
          </li>
          <li>
            <strong>Brewery dataset.</strong>
            <a
              href={DATASET_REPO_URL}
              class="underline decoration-amber-300 hover:text-amber-800"
              rel="noopener noreferrer"
              target="_blank">openbrewerydb/openbrewerydb</a
            >
            — the underlying brewery dataset this site wraps; data contributions belong there.
          </li>
          <li>
            <strong>Public API.</strong>
            <a
              href={API_URL}
              class="underline decoration-amber-300 hover:text-amber-800"
              rel="noopener noreferrer"
              target="_blank">{API_URL}</a
            >
            — the REST API whose traffic is measured here; see the
            <a
              href={DOCS_URL}
              class="underline decoration-amber-300 hover:text-amber-800">documentation</a
            >.
          </li>
        </ul>

        <h3>Notes</h3>
        <p>
          All times are UTC. The hourly window shows the most recent {metrics.hourly.window_hours}
          hours; the daily chart shows {metrics.daily.window_days} complete days, with today
          omitted to avoid a misleading partial-day drop. Data is refreshed hourly; if the
          "last updated" time is more than 90 minutes old, the collector is behind and values
          may be stale.
        </p>
      </div>
    </section>

    <section class="mt-8 max-w-3xl">
      <div
        class="border-l-4 border-amber-300 bg-amber-50/60 px-5 py-4 rounded-r-lg"
      >
        <p class="font-serif text-xs uppercase tracking-wide text-gray-500 mb-1">
          Suggested citation
        </p>
        <p class="text-sm text-gray-700 leading-relaxed">
          Open Brewery DB. <em>Usage statistics</em>. Retrieved
          {formatAbsoluteTime(metrics.last_updated)} from
          <a
            href="https://openbrewerydb.org/stats"
            class="underline decoration-amber-300 hover:text-amber-800"
            >https://openbrewerydb.org/stats</a
          >. Source data:
          <a
            href={sourceUrl}
            class="underline decoration-amber-300 hover:text-amber-800"
            rel="noopener noreferrer"
            target="_blank">{sourceUrl}</a
          >.
        </p>
      </div>
    </section>
  {/if}
</div>
