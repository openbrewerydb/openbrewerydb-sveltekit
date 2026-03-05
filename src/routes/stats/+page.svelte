<script lang="ts">
  import type { PageData } from './$types';
  import { formatNumber, formatBandwidth, formatRelativeTime, formatAbsoluteTime, isDataStale } from '$lib/utils/metrics';
  import { BarChart3, Activity, Users, HardDrive, TrendingUp, Globe } from 'lucide-svelte';
  import SEO from '$lib/components/SEO.svelte';
  import { Chart, Svg, Tooltip } from 'layerchart';
  import { scaleOrdinal } from 'd3-scale';
  import { schemeTableau10 } from 'd3-scale-chromatic';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const colorScale = scaleOrdinal(schemeTableau10);

  const getChartData = (breakdown: { api: number; www: number; other: number }) => {
    return [
      { label: 'API', value: breakdown.api, color: '#d97706' },
      { label: 'Website', value: breakdown.www, color: '#f59e0b' },
      { label: 'Other', value: breakdown.other, color: '#fbbf24' }
    ].filter(item => item.value > 0);
  };

  const requestsChart24h = $derived(data.metrics ? getChartData(data.metrics.periods.last_24_hours.requests) : []);
  const requestsChart7d = $derived(data.metrics ? getChartData(data.metrics.periods.last_7_days.requests) : []);
</script>

<SEO 
  title="Statistics & Transparency Dashboard" 
  description="Real-time statistics showing OpenBreweryDB API usage, website traffic, and bandwidth metrics. Transparency for our community and sponsors."
/>

<div class="max-w-7xl mx-auto">
  <div class="text-center mb-12">
    <h1 class="text-4xl font-extrabold text-gray-900 mb-4">
      Transparency Dashboard
    </h1>
    <p class="text-lg text-gray-600 max-w-3xl mx-auto">
      We believe in transparency. Here are the real-time statistics showing how developers 
      and breweries around the world use OpenBreweryDB. This data helps potential sponsors 
      understand our reach and impact.
    </p>
  </div>

  {#if data.error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-800 font-medium">{data.error}</p>
      <p class="text-red-600 text-sm mt-2">Please try again later or contact support if the issue persists.</p>
    </div>
  {:else if data.metrics}
    <div class="mb-8 text-center">
      {#if isDataStale(data.metrics.last_updated)}
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 inline-block">
          <p class="text-amber-800 font-medium">⚠️ Metrics data may be outdated</p>
          <p class="text-amber-700 text-sm">Last updated: {formatAbsoluteTime(data.metrics.last_updated)}</p>
        </div>
      {:else}
        <p class="text-gray-600">
          <span class="font-medium">Last updated:</span> {formatRelativeTime(data.metrics.last_updated)}
          <span class="text-gray-400 mx-2">•</span>
          <span class="text-sm">{formatAbsoluteTime(data.metrics.last_updated)}</span>
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
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <BarChart3 class="w-8 h-8 text-amber-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">
            {formatNumber(data.metrics.periods.last_24_hours.requests.total)}
          </div>
          <div class="text-sm font-medium text-gray-700 mb-2">Total Requests</div>
          <div class="text-xs text-gray-500 space-y-1">
            <div>API: {formatNumber(data.metrics.periods.last_24_hours.requests.api)}</div>
            <div>Website: {formatNumber(data.metrics.periods.last_24_hours.requests.www)}</div>
            {#if data.metrics.periods.last_24_hours.requests.other > 0}
              <div>Other: {formatNumber(data.metrics.periods.last_24_hours.requests.other)}</div>
            {/if}
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <Activity class="w-8 h-8 text-amber-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">
            {formatNumber(data.metrics.periods.last_24_hours.requests.api)}
          </div>
          <div class="text-sm font-medium text-gray-700 mb-2">API Requests</div>
          <div class="text-xs text-gray-500">
            {((data.metrics.periods.last_24_hours.requests.api / data.metrics.periods.last_24_hours.requests.total) * 100).toFixed(1)}% of total traffic
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <Users class="w-8 h-8 text-amber-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">
            {formatNumber(data.metrics.periods.last_24_hours.visits.total)}
          </div>
          <div class="text-sm font-medium text-gray-700 mb-2">Total Visits</div>
          <div class="text-xs text-gray-500 space-y-1">
            <div>API: {formatNumber(data.metrics.periods.last_24_hours.visits.api)}</div>
            <div>Website: {formatNumber(data.metrics.periods.last_24_hours.visits.www)}</div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <HardDrive class="w-8 h-8 text-amber-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">
            {formatBandwidth(data.metrics.periods.last_24_hours.bandwidth_tb)}
          </div>
          <div class="text-sm font-medium text-gray-700 mb-2">Bandwidth</div>
          <div class="text-xs text-gray-500">
            Data transferred
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Request Distribution (24h)</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          {#each requestsChart24h as item}
            <div class="flex items-center">
              <div class="w-4 h-4 rounded mr-3" style="background-color: {item.color}"></div>
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-700">{item.label}</div>
                <div class="text-xs text-gray-500">{formatNumber(item.value)} requests</div>
              </div>
              <div class="text-sm font-semibold text-gray-900">
                {((item.value / data.metrics.periods.last_24_hours.requests.total) * 100).toFixed(1)}%
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
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <BarChart3 class="w-8 h-8 text-amber-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">
            {formatNumber(data.metrics.periods.last_7_days.requests.total)}
          </div>
          <div class="text-sm font-medium text-gray-700 mb-2">Total Requests</div>
          <div class="text-xs text-gray-500 space-y-1">
            <div>API: {formatNumber(data.metrics.periods.last_7_days.requests.api)}</div>
            <div>Website: {formatNumber(data.metrics.periods.last_7_days.requests.www)}</div>
            {#if data.metrics.periods.last_7_days.requests.other > 0}
              <div>Other: {formatNumber(data.metrics.periods.last_7_days.requests.other)}</div>
            {/if}
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <Activity class="w-8 h-8 text-amber-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">
            {formatNumber(data.metrics.periods.last_7_days.requests.api)}
          </div>
          <div class="text-sm font-medium text-gray-700 mb-2">API Requests</div>
          <div class="text-xs text-gray-500">
            {((data.metrics.periods.last_7_days.requests.api / data.metrics.periods.last_7_days.requests.total) * 100).toFixed(1)}% of total traffic
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <Users class="w-8 h-8 text-amber-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">
            {formatNumber(data.metrics.periods.last_7_days.visits.total)}
          </div>
          <div class="text-sm font-medium text-gray-700 mb-2">Total Visits</div>
          <div class="text-xs text-gray-500 space-y-1">
            <div>API: {formatNumber(data.metrics.periods.last_7_days.visits.api)}</div>
            <div>Website: {formatNumber(data.metrics.periods.last_7_days.visits.www)}</div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <HardDrive class="w-8 h-8 text-amber-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">
            {formatBandwidth(data.metrics.periods.last_7_days.bandwidth_tb)}
          </div>
          <div class="text-sm font-medium text-gray-700 mb-2">Bandwidth</div>
          <div class="text-xs text-gray-500">
            Data transferred
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Request Distribution (7d)</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          {#each requestsChart7d as item}
            <div class="flex items-center">
              <div class="w-4 h-4 rounded mr-3" style="background-color: {item.color}"></div>
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-700">{item.label}</div>
                <div class="text-xs text-gray-500">{formatNumber(item.value)} requests</div>
              </div>
              <div class="text-sm font-semibold text-gray-900">
                {((item.value / data.metrics.periods.last_7_days.requests.total) * 100).toFixed(1)}%
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">About These Metrics</h2>
      <div class="max-w-3xl mx-auto text-left space-y-4 text-gray-700">
        <p>
          <strong class="text-gray-900">Requests:</strong> Total number of HTTP requests to our API and website, 
          including both successful responses and errors.
        </p>
        <p>
          <strong class="text-gray-900">Visits:</strong> Unique visitor sessions tracked by Cloudflare, 
          representing individual users accessing our services.
        </p>
        <p>
          <strong class="text-gray-900">Bandwidth:</strong> Total data transferred from our servers to users, 
          measured in terabytes (TB) or gigabytes (GB).
        </p>
        <p>
          <strong class="text-gray-900">Why transparency matters:</strong> As an open-source project, 
          we believe in sharing our metrics with the community. This helps potential sponsors understand 
          our reach and allows developers to see the scale of OpenBreweryDB's impact.
        </p>
        <p class="text-sm text-gray-600">
          Data is collected via Cloudflare Analytics and updated daily. All metrics are aggregated 
          and do not contain any personally identifiable information.
        </p>
      </div>
    </section>
  {/if}
</div>
