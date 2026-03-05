<script lang="ts">
  import type { PageData } from './$types';
  import {
    formatNumber,
    formatCompactNumber,
    formatBandwidth,
    formatRelativeTime,
    formatAbsoluteTime,
    isDataStale,
  } from '$lib/utils/metrics';
  import {
    BarChart3,
    Activity,
    Users,
    HardDrive,
    TrendingUp,
    Globe,
  } from 'lucide-svelte';
  import SEO from '$lib/components/SEO.svelte';
  import MetricCard from '$lib/components/MetricCard.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const getStackedChartData = (breakdown: {
    api: number;
    www: number;
    other: number;
  }) => {
    const total = breakdown.api + breakdown.www + breakdown.other;
    return {
      total,
      segments: [
        {
          label: 'API',
          value: breakdown.api,
          percentage: (breakdown.api / total) * 100,
          color: '#d97706',
        },
        {
          label: 'Website',
          value: breakdown.www,
          percentage: (breakdown.www / total) * 100,
          color: '#f59e0b',
        },
        ...(breakdown.other > 0
          ? [
              {
                label: 'Other',
                value: breakdown.other,
                percentage: (breakdown.other / total) * 100,
                color: '#fbbf24',
              },
            ]
          : []),
      ],
    };
  };

  const requestsChart24h = $derived(
    data.metrics
      ? getStackedChartData(data.metrics.periods.last_24_hours.requests)
      : { total: 0, segments: [] }
  );
  const requestsChart7d = $derived(
    data.metrics
      ? getStackedChartData(data.metrics.periods.last_7_days.requests)
      : { total: 0, segments: [] }
  );
</script>

<SEO
  title="Statistics Dashboard"
  description="Daily-updated statistics showing OpenBreweryDB API usage, website traffic, and bandwidth metrics."
/>

<div class="max-w-7xl mx-auto">
  <div class="text-center mb-12">
    <h1 class="text-4xl font-extrabold text-gray-900 mb-4">
      Statistics Dashboard
    </h1>
    <p class="text-lg text-gray-600 max-w-3xl mx-auto">
      Here are the daily-updated statistics showing how developers and breweries
      around the world use OpenBreweryDB.
    </p>
  </div>

  {#if data.error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-800 font-medium">{data.error}</p>
      <p class="text-red-600 text-sm mt-2">
        Please try again later or contact support if the issue persists.
      </p>
    </div>
  {:else if data.metrics}
    <div class="mb-8 text-center">
      {#if isDataStale(data.metrics.last_updated)}
        <div
          class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 inline-block"
        >
          <p class="text-amber-800 font-medium">
            ⚠️ Metrics data may be outdated
          </p>
          <p class="text-amber-700 text-sm">
            Last updated: {formatAbsoluteTime(data.metrics.last_updated)}
          </p>
        </div>
      {:else}
        <p class="text-gray-600">
          <span class="font-medium">Last updated:</span>
          {formatRelativeTime(data.metrics.last_updated)}
          <span class="text-gray-400 mx-2">•</span>
          <span class="text-sm"
            >{formatAbsoluteTime(data.metrics.last_updated)}</span
          >
        </p>
      {/if}
      <p class="text-sm text-gray-500 mt-2">
        Data refreshes daily via automated Cloudflare Workers
      </p>
    </div>

    <section class="mb-16">
      <div class="flex items-center justify-center mb-6">
        <TrendingUp class="w-6 h-6 text-amber-600 mr-2" />
        <h2 class="text-3xl font-bold text-gray-900">Last 24 Hours</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={BarChart3}
          value={data.metrics.periods.last_24_hours.requests.total}
          label="Total Requests"
          breakdown={[
            {
              label: 'API',
              value: data.metrics.periods.last_24_hours.requests.api,
            },
            {
              label: 'Website',
              value: data.metrics.periods.last_24_hours.requests.www,
            },
            ...(data.metrics.periods.last_24_hours.requests.other > 0
              ? [
                  {
                    label: 'Other',
                    value: data.metrics.periods.last_24_hours.requests.other,
                  },
                ]
              : []),
          ]}
        />

        <MetricCard
          icon={Activity}
          value={data.metrics.periods.last_24_hours.requests.api}
          label="API Requests"
          subtitle="{(
            (data.metrics.periods.last_24_hours.requests.api /
              data.metrics.periods.last_24_hours.requests.total) *
            100
          ).toFixed(1)}% of total traffic"
        />

        <MetricCard
          icon={Users}
          value={data.metrics.periods.last_24_hours.visits.total}
          label="Total Visits"
          breakdown={[
            {
              label: 'API',
              value: data.metrics.periods.last_24_hours.visits.api,
            },
            {
              label: 'Website',
              value: data.metrics.periods.last_24_hours.visits.www,
            },
          ]}
        />

        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <HardDrive class="w-8 h-8 text-amber-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">
            {formatBandwidth(data.metrics.periods.last_24_hours.bandwidth_tb)}
          </div>
          <div class="text-sm font-medium text-gray-700 mb-2">Bandwidth</div>
          <div class="text-xs text-gray-500">Data transferred</div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Request Distribution (24h)
        </h3>

        <div class="mb-6">
          <div class="flex h-12 rounded-lg overflow-hidden shadow-sm">
            {#each requestsChart24h.segments as segment}
              <div
                class="flex items-center justify-center text-white font-medium text-sm transition-all hover:opacity-90"
                style="background-color: {segment.color}; width: {segment.percentage}%"
                title="{segment.label}: {formatNumber(
                  segment.value
                )} ({segment.percentage.toFixed(1)}%)"
              >
                {#if segment.percentage > 8}
                  <span class="px-2">{segment.percentage.toFixed(1)}%</span>
                {/if}
              </div>
            {/each}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          {#each requestsChart24h.segments as segment}
            <div class="flex items-center">
              <div
                class="w-4 h-4 rounded mr-3"
                style="background-color: {segment.color}"
              ></div>
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-700">
                  {segment.label}
                </div>
                <div class="text-xs text-gray-500">
                  {formatNumber(segment.value)} requests
                </div>
              </div>
              <div class="text-sm font-semibold text-gray-900">
                {segment.percentage.toFixed(1)}%
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="mb-16">
      <div class="flex items-center justify-center mb-6">
        <Globe class="w-6 h-6 text-amber-600 mr-2" />
        <h2 class="text-3xl font-bold text-gray-900">Last 7 Days</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={BarChart3}
          value={data.metrics.periods.last_7_days.requests.total}
          label="Total Requests"
          breakdown={[
            {
              label: 'API',
              value: data.metrics.periods.last_7_days.requests.api,
            },
            {
              label: 'Website',
              value: data.metrics.periods.last_7_days.requests.www,
            },
            ...(data.metrics.periods.last_7_days.requests.other > 0
              ? [
                  {
                    label: 'Other',
                    value: data.metrics.periods.last_7_days.requests.other,
                  },
                ]
              : []),
          ]}
        />

        <MetricCard
          icon={Activity}
          value={data.metrics.periods.last_7_days.requests.api}
          label="API Requests"
          subtitle="{(
            (data.metrics.periods.last_7_days.requests.api /
              data.metrics.periods.last_7_days.requests.total) *
            100
          ).toFixed(1)}% of total traffic"
        />

        <MetricCard
          icon={Users}
          value={data.metrics.periods.last_7_days.visits.total}
          label="Total Visits"
          breakdown={[
            {
              label: 'API',
              value: data.metrics.periods.last_7_days.visits.api,
            },
            {
              label: 'Website',
              value: data.metrics.periods.last_7_days.visits.www,
            },
          ]}
        />

        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <HardDrive class="w-8 h-8 text-amber-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">
            {formatBandwidth(data.metrics.periods.last_7_days.bandwidth_tb)}
          </div>
          <div class="text-sm font-medium text-gray-700 mb-2">Bandwidth</div>
          <div class="text-xs text-gray-500">Data transferred</div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Request Distribution (7d)
        </h3>

        <div class="mb-6">
          <div class="flex h-12 rounded-lg overflow-hidden shadow-sm">
            {#each requestsChart7d.segments as segment}
              <div
                class="flex items-center justify-center text-white font-medium text-sm transition-all hover:opacity-90"
                style="background-color: {segment.color}; width: {segment.percentage}%"
                title="{segment.label}: {formatNumber(
                  segment.value
                )} ({segment.percentage.toFixed(1)}%)"
              >
                {#if segment.percentage > 8}
                  <span class="px-2">{segment.percentage.toFixed(1)}%</span>
                {/if}
              </div>
            {/each}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          {#each requestsChart7d.segments as segment}
            <div class="flex items-center">
              <div
                class="w-4 h-4 rounded mr-3"
                style="background-color: {segment.color}"
              ></div>
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-700">
                  {segment.label}
                </div>
                <div class="text-xs text-gray-500">
                  {formatNumber(segment.value)} requests
                </div>
              </div>
              <div class="text-sm font-semibold text-gray-900">
                {segment.percentage.toFixed(1)}%
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section
      class="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center"
    >
      <h2 class="text-2xl font-bold text-gray-900 mb-4">About These Metrics</h2>
      <div class="max-w-3xl mx-auto text-left space-y-4 text-gray-700">
        <p>
          <strong class="text-gray-900">Requests:</strong> Total number of HTTP requests
          to our API and website, including both successful responses and errors.
        </p>
        <p>
          <strong class="text-gray-900">Visits:</strong> Unique visitor sessions tracked
          by Cloudflare, representing individual users accessing our services.
        </p>
        <p>
          <strong class="text-gray-900">Bandwidth:</strong> Total data transferred
          from our servers to users, measured in terabytes (TB) or gigabytes (GB).
        </p>
        <p>
          <strong class="text-gray-900">Why transparency matters:</strong> As an open-source
          project, we believe in sharing our metrics with the community. This helps
          potential sponsors understand our reach and allows developers to see the
          scale of OpenBreweryDB's impact.
        </p>
        <p class="text-sm text-gray-600">
          Data is collected via Cloudflare Analytics and updated daily. All
          metrics are aggregated and do not contain any personally identifiable
          information.
        </p>
      </div>
    </section>
  {/if}
</div>
