<script>
  // These props get filled in from the page's front matter
  export let title = 'Open Brewery DB Article';
  export let coverImageUrl = '/obdb-og.png';
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
  <meta property="og:image" content={coverImageUrl} />
</svelte:head>

<article>
  <h1>{title}</h1>
  <slot />
  <a href="/blog">Back to articles</a>
</article>
