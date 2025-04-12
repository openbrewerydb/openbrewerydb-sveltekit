<script lang="ts">
  import MarkdownContent from '$lib/components/MarkdownContent.svelte';
  
  interface Props {
    title?: string;
    description?: string;
    coverImageUrl?: string;
    children?: import('svelte').Snippet;
  }

  let {
    title = 'Article',
    description = 'A worldwide open-source brewery dataset and API',
    coverImageUrl = '/obdb-og.png',
    children
  }: Props = $props();
</script>

<svelte:head>
  <title>{title}</title>

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

<MarkdownContent>
  <h1>{title}</h1>
  {@render children?.()}
  <a href="/blog" class="inline-block mt-6">Back to articles</a>
</MarkdownContent>
