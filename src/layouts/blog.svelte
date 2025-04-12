<script lang="ts">
  import MarkdownContent from '$lib/components/MarkdownContent.svelte';
  
  export let title: string = 'Article';
  export let description: string = 'A worldwide open-source brewery dataset and API';
  export let coverImageUrl: string = '/obdb-og.png';
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
  <slot />
  <a href="/blog" class="inline-block mt-6">Back to articles</a>
</MarkdownContent>
