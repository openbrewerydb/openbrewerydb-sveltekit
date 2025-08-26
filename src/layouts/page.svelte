<script lang="ts">
  import MarkdownContent from '$lib/components/MarkdownContent.svelte';
  import SEO from '$lib/components/SEO.svelte';

  interface Props {
    title: string;
    description?: string;
    coverImageUrl?: string;
    children?: import('svelte').Snippet;
  }

  let {
    title,
    description = 'A worldwide open-source brewery dataset and API',
    coverImageUrl = '/obdb-og.png',
    children,
  }: Props = $props();
</script>

<SEO title={title} description={description} image={coverImageUrl} type="article" />

<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
  <MarkdownContent>
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-800 mb-6">
      {title}
    </h1>
    {@render children?.()}
  </MarkdownContent>
</div>
