<script>
  export let title = 'Article';
  export let description = 'A worldwide open-source brewery dataset and API';
  export let coverImageUrl = '/obdb-og.png';
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content="Open Brewery DB | {title}" />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={coverImageUrl} />
</svelte:head>

<article>
  <h1>{title}</h1>
  <slot />
  <a href="/blog">Back to articles</a>
</article>
