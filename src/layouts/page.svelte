<script lang="ts">
  import MarkdownContent from '$lib/components/MarkdownContent.svelte';

  interface Props {
    title: string;
    description?: string;
    coverImageUrl?: string;
    children?: import('svelte').Snippet;
  }

  let {
    title,
    description = 'A worldwide open-source brewery dataset and API',
    coverImageUrl = 'https://www.openbrewerydb.org/obdb-og.png',
    children
  }: Props = $props();
</script>

<svelte:head>
  <title>Open Brewery DB | {title}</title>
  <meta
    property="og:title"
    content="Open Brewery DB{title ? ` | ${title}` : ''}"
  />

  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={coverImageUrl} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@openbrewerydb" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={coverImageUrl} />
</svelte:head>

<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
  <MarkdownContent>
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-800 mb-6">{title}</h1>
    {@render children?.()}
  </MarkdownContent>
</div>
