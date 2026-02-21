<script lang="ts">
  import { getContext } from 'svelte';
  import type { SEOConfig, RobotsConfig } from '../seo';
  import {
    SEO_CTX,
    mergeSEO,
    applyTitleTemplate,
    canonicalFrom,
    formatRobotsMeta,
    absoluteFrom,
  } from '../seo';
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

  const shorthand = $derived.by((): SEOConfig => {
    const next: SEOConfig = {};
    if (title !== undefined) next.title = title;
    if (description !== undefined) next.description = description;
    if (canonical !== undefined) next.canonical = canonical;
    if (robots !== undefined) next.robots = robots;

    const ogInput: Record<string, any> = {};
    if (type !== undefined) ogInput.type = type;
    if (image !== undefined) ogInput.image = image;
    if (siteName !== undefined) ogInput.siteName = siteName;
    if (Object.keys(ogInput).length > 0) next.openGraph = ogInput as any;

    return next;
  });

  const merged = $derived(mergeSEO(parent, value ?? shorthand));

  const finalCanonical = $derived(
    merged.canonical || (page?.url ? canonicalFrom(page.url) : undefined)
  );

  const finalTitle = $derived(
    applyTitleTemplate(merged.title, merged.titleTemplate)
  );

  const ogType = $derived(merged.openGraph?.type);
  const ogSiteName = $derived(merged.openGraph?.siteName);
  const ogImage = $derived(merged.openGraph?.image);
  const ogUrl = $derived(merged.openGraph?.url || finalCanonical);
  const absOgUrl = $derived(absoluteFrom(ogUrl, page?.url));
  const absOgImage = $derived(absoluteFrom(ogImage, page?.url));
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
    <link rel="canonical" href={absOgUrl} />
    <meta property="og:url" content={absOgUrl} />
  {/if}

  {#if robotsContent}
    <meta name="robots" content={robotsContent} />
  {/if}

  {#if ogType}
    <meta property="og:type" content={ogType} />
  {/if}

  {#if ogSiteName}
    <meta property="og:site_name" content={ogSiteName} />
  {/if}

  {#if ogImage}
    <meta property="og:image" content={absOgImage} />
  {/if}
</svelte:head>
