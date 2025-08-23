<script lang="ts">
  import MarkdownContent from '$lib/components/MarkdownContent.svelte';
  import Byline from '$lib/components/Byline.svelte';

  interface Props {
    title?: string;
    description?: string;
    coverImageUrl?: string;
    date?: string;
    author?: string;
    authors?: string[];
    children?: import('svelte').Snippet;
  }

  let {
    title = 'Article',
    description = 'A worldwide open-source brewery dataset and API',
    coverImageUrl = '/obdb-og.png',
    date,
    author,
    authors,
    children,
  }: Props = $props();

  const normalizedAuthors = $derived(
    (
      (authors && authors.length ? authors : author ? [author] : []) as string[]
    ).map((a) => a.toLowerCase())
  );
</script>

<svelte:head>
  <title>{title}</title>

  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={coverImageUrl} />
</svelte:head>

<MarkdownContent>
  <h1 class="my-2">{title}</h1>
  {#if normalizedAuthors.length || date}
    <div class="my-2">
      <Byline authors={normalizedAuthors} {date} />
    </div>
  {/if}
  <div class="my-6">
    {@render children?.()}
  </div>
  <a href="/blog" class="inline-block mt-6">Back to blog</a>
</MarkdownContent>
