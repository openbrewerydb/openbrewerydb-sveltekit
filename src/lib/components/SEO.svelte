<script lang="ts">
  import { getContext } from 'svelte';
  import type { SEOConfig, RobotsConfig } from './seo';
  import {
    SEO_CTX,
    mergeSEO,
    applyTitleTemplate,
    canonicalFrom,
    formatRobotsMeta,
  } from './seo';
  import { page } from '$app/state';

  interface Props {
    value?: SEOConfig;
    title?: string;
    description?: string;
    canonical?: string;
    type?: string;
    image?: string;
    siteName?: string;
    robots?: RobotsConfig;
  }

  let {
    value,
    title,
    description,
    canonical,
    type,
    image,
    siteName,
    robots,
  }: Props = $props();

  const parent: SEOConfig | undefined = getContext<SEOConfig | undefined>(
    SEO_CTX
  );

  const shorthand: SEOConfig = {
    title,
    description,
    canonical,
    robots,
    openGraph: { type, image, siteName },
  };

  const merged = $derived(
    mergeSEO(parent, mergeSEO(undefined, value || shorthand))
  );

  const finalCanonical = $derived(
    merged.canonical || (page?.url ? canonicalFrom(page.url) : undefined)
  );

  const finalTitle = $derived(
    applyTitleTemplate(merged.title, merged.titleTemplate)
  );

  const og = $derived(merged.openGraph || {});
  const ogUrl = $derived(og.url || finalCanonical);
  const robotsContent = $derived(formatRobotsMeta(merged.robots));
</script>

<svelte:head>
  {#if finalTitle}
    <title>{finalTitle}</title>
    <meta property="og:title" content={finalTitle} />
  {/if}

  {#if merged.description}
    <meta name="description" content={merged.description} />
    <meta property="og:description" content={merged.description} />
  {/if}

  {#if finalCanonical}
    <link rel="canonical" href={ogUrl} />
    <meta property="og:url" content={ogUrl} />
  {/if}

  {#if robotsContent}
    <meta name="robots" content={robotsContent} />
  {/if}

  {#if og.type}
    <meta property="og:type" content={og.type} />
  {/if}

  {#if og.siteName}
    <meta property="og:site_name" content={og.siteName} />
  {/if}

  {#if og.image}
    <meta property="og:image" content={og.image} />
  {/if}
</svelte:head>
