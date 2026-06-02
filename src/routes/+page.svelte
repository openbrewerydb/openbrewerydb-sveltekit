<script lang="ts">
  import type { PageData } from './$types';
  import {
    Search,
    Beer,
    Globe,
    MapPin,
    Tag,
    Cpu,
    Github,
    Download,
    Heart,
  } from 'lucide-svelte';
  import { formatNumber } from '$lib/utils/metrics';
  import SEO from '$lib/components/SEO.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import MetricsSummary from '$lib/components/MetricsSummary.svelte';
  import SponsorshipSection from '$lib/components/SponsorshipSection.svelte';
  import Contributors from '$lib/components/Contributors.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<SEO
  title="Open Brewery DB"
  description="A worldwide open-source brewery dataset and API"
/>

<div class="space-y-20 pb-12">
  <!-- Hero Section -->
  <div class="text-center">
    <Hero
      title="Free and open-source"
      subtitle="brewery data"
      description="Open Brewery DB is a free dataset and API with public information on breweries, cideries, brewpubs, and bottleshops."
      ctaText="Read API Documentation"
      ctaHref="/documentation"
    />

    <!-- Quick Search Bar -->
    <div class="max-w-2xl mx-auto mt-8 px-4">
      <form
        action="/breweries"
        method="get"
        class="relative flex items-center bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all"
      >
        <div class="pl-4 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="search"
          name="query"
          placeholder="Search 8,000+ breweries, cities, types..."
          class="w-full py-4 pl-3 pr-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-base border-none ring-0 focus:ring-0"
          required
        />
        <button
          type="submit"
          class="m-1.5 px-6 py-3 rounded-lg text-white bg-amber-600 hover:bg-amber-700 font-medium text-base transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 cursor-pointer"
        >
          Search
        </button>
      </form>
      <p class="text-xs text-gray-600 mt-2.5 text-center">
        Try searching for&nbsp;
        {#each data.searchSuggestions || [] as suggestion, i (suggestion)}
          <a
            href="/breweries?query={encodeURIComponent(
              suggestion.toLowerCase()
            )}"
            class="text-amber-600 underline hover:text-amber-800 transition-colors"
            >{suggestion}</a
          >{#if i < (data.searchSuggestions || []).length - 2},&nbsp;{/if}{#if i === (data.searchSuggestions || []).length - 2},&nbsp;or&nbsp;{/if}
        {/each}
      </p>
    </div>
  </div>

  <!-- Dataset Scale Statistics -->
  <section class="max-w-6xl mx-auto px-4" aria-labelledby="stats-title">
    <div class="text-center mb-10">
      <h2
        id="stats-title"
        class="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl"
      >
        The Dataset by the Numbers
      </h2>
      <p class="mt-3 max-w-2xl mx-auto text-base text-gray-700 sm:text-lg">
        Open Brewery DB is the leading open-source database for craft beer
        lovers, developers, and researchers.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Breweries Card -->
      <a
        href="/breweries"
        class="group relative flex flex-col justify-between bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-amber-500 p-6 transition-all duration-300 transform hover:-translate-y-1"
      >
        <div>
          <div class="flex items-center justify-between mb-4">
            <div
              class="p-3 bg-amber-50 rounded-lg text-amber-600 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors"
            >
              <Beer size={24} />
            </div>
            <span
              class="text-xs font-semibold text-gray-400 group-hover:text-amber-600 transition-colors uppercase tracking-wider"
              >Explore →</span
            >
          </div>
          <div
            class="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight group-hover:text-amber-600 transition-colors"
          >
            {data.dbMetrics ? formatNumber(data.dbMetrics.total) : '8,000+'}
          </div>
          <div class="text-base font-bold text-gray-800 mb-1">Breweries</div>
          <p class="text-sm text-gray-600 leading-relaxed">
            Comprehensive registry of microbreweries, brewpubs, cideries, and
            more.
          </p>
        </div>
      </a>

      <!-- Countries Card -->
      <a
        href="/breweries/browse"
        class="group relative flex flex-col justify-between bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-amber-500 p-6 transition-all duration-300 transform hover:-translate-y-1"
      >
        <div>
          <div class="flex items-center justify-between mb-4">
            <div
              class="p-3 bg-amber-50 rounded-lg text-amber-600 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors"
            >
              <Globe size={24} />
            </div>
            <span
              class="text-xs font-semibold text-gray-400 group-hover:text-amber-600 transition-colors uppercase tracking-wider"
              >Browse →</span
            >
          </div>
          <div
            class="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight group-hover:text-amber-600 transition-colors"
          >
            {data.dbMetrics ? `${data.dbMetrics.countriesCount}+` : '10+'}
          </div>
          <div class="text-base font-bold text-gray-800 mb-1">Countries</div>
          <p class="text-sm text-gray-600 leading-relaxed">
            Search across major craft beer nations and international regions.
          </p>
        </div>
      </a>

      <!-- States Card -->
      <a
        href="/breweries/browse"
        class="group relative flex flex-col justify-between bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-amber-500 p-6 transition-all duration-300 transform hover:-translate-y-1"
      >
        <div>
          <div class="flex items-center justify-between mb-4">
            <div
              class="p-3 bg-amber-50 rounded-lg text-amber-600 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors"
            >
              <MapPin size={24} />
            </div>
            <span
              class="text-xs font-semibold text-gray-400 group-hover:text-amber-600 transition-colors uppercase tracking-wider"
              >Browse →</span
            >
          </div>
          <div
            class="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight group-hover:text-amber-600 transition-colors"
          >
            {data.dbMetrics ? `${data.dbMetrics.statesCount}+` : '150+'}
          </div>
          <div class="text-base font-bold text-gray-800 mb-1">
            States & Regions
          </div>
          <p class="text-sm text-gray-600 leading-relaxed">
            Drill down into specific local administrative areas and state
            territories.
          </p>
        </div>
      </a>

      <!-- Types Card -->
      <a
        href="/breweries/browse"
        class="group relative flex flex-col justify-between bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-amber-500 p-6 transition-all duration-300 transform hover:-translate-y-1"
      >
        <div>
          <div class="flex items-center justify-between mb-4">
            <div
              class="p-3 bg-amber-50 rounded-lg text-amber-600 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors"
            >
              <Tag size={24} />
            </div>
            <span
              class="text-xs font-semibold text-gray-400 group-hover:text-amber-600 transition-colors uppercase tracking-wider"
              >Browse →</span
            >
          </div>
          <div
            class="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight group-hover:text-amber-600 transition-colors"
          >
            {data.dbMetrics ? data.dbMetrics.typesCount : '10'}
          </div>
          <div class="text-base font-bold text-gray-800 mb-1">
            Brewery Types
          </div>
          <p class="text-sm text-gray-600 leading-relaxed">
            Categorized by micro, brewpub, planning, contract, and regional
            operations.
          </p>
        </div>
      </a>
    </div>
  </section>

  <!-- Feature & Capabilities Grid -->
  <section class="max-w-6xl mx-auto px-4" aria-labelledby="features-title">
    <div class="text-center mb-12">
      <h2
        id="features-title"
        class="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl"
      >
        A Modern, Open Dataset for Everyone
      </h2>
      <p class="mt-4 max-w-2xl mx-auto text-base text-gray-700 sm:text-lg">
        Open Brewery DB is designed from the ground up to be developer-friendly,
        community-driven, and completely accessible.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Feature 1: Free API -->
      <div
        class="flex gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm"
      >
        <div
          class="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-amber-50 text-amber-600"
        >
          <Cpu size={24} />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">
            Free REST API Access
          </h3>
          <p class="text-sm text-gray-700 leading-relaxed">
            Query our developer-friendly JSON API. No sign-ups, API keys, or
            rate limits. Perfect for web apps, student projects, or live
            integrations.
          </p>
        </div>
      </div>

      <!-- Feature 2: Open Source -->
      <div
        class="flex gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm"
      >
        <div
          class="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-amber-50 text-amber-600"
        >
          <Github size={24} />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">
            Community & GitHub Powered
          </h3>
          <p class="text-sm text-gray-700 leading-relaxed">
            The dataset is maintained entirely on GitHub. Submit corrections,
            add your local breweries, or suggest updates via pull requests.
          </p>
        </div>
      </div>

      <!-- Feature 3: Multiple Formats -->
      <div
        class="flex gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm"
      >
        <div
          class="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-amber-50 text-amber-600"
        >
          <Download size={24} />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">Bulk Downloads</h3>
          <p class="text-sm text-gray-700 leading-relaxed">
            Need offline access? Download the complete dataset in raw formats
            like CSV or SQL to power your own database or perform offline
            analytics.
          </p>
        </div>
      </div>

      <!-- Feature 4: Open Belief -->
      <div
        class="flex gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm"
      >
        <div
          class="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-amber-50 text-amber-600"
        >
          <Heart size={24} />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">
            Our Belief & Mission
          </h3>
          <p class="text-sm text-gray-700 leading-relaxed">
            Public data should remain public. We believe in keeping data freely
            accessible for the betterment of the community and developer
            happiness.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Usage Statistics (Cloudflare metrics) -->
  <MetricsSummary metrics={data.metrics} />

  <!-- Sponsorship -->
  <SponsorshipSection />

  <!-- Contributors List -->
  <Contributors />
</div>
