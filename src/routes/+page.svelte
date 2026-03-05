<script lang="ts">
  import type { PageData } from './$types';
  import SEO from '$lib/components/SEO.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import SectionContent from '$lib/components/SectionContent.svelte';
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

<div class="text-center">
  <Hero
    title="Free and open-source"
    subtitle="brewery data"
    description="Open Brewery DB is a free dataset and API with public information on breweries, cideries, brewpubs, and bottleshops."
    ctaText="Read API Documentation"
    ctaHref="/documentation"
  />
  <div class="mt-12">
    <SectionContent
      title="The Goal"
      content="The goal of Open Brewery DB is to maintain an open-source, community-driven dataset and provide a public API for brewery-related data."
    />
    <SectionContent
      title="The Mission"
      content="It is our belief that public information should be freely accessible for the betterment of the community and the happiness of web developers and data analysts."
    />
  </div>
  <MetricsSummary metrics={data.metrics} />
  <SponsorshipSection />
  <Contributors />
</div>
