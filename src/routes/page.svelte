<script>
  export let title = 'Open Brewery DB';
  export let coverImageUrl = '/obdb-og.jpg';
</script>

<svelte:head>
  <title>Open Brewery DB | {title}</title>
  <meta property="og:title" content="Open Brewery DB | {title}" />
  <meta property="og:image" content={coverImageUrl} />
</svelte:head>

<article class="markdown">
  <h1>{title}</h1>
  <div>
    <slot />
  </div>
</article>
