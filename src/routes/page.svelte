<script>
  export let title;
  export let description = 'A worldwide open-source brewery dataset and API';
  export let coverImageUrl = '/obdb-og.png';
</script>

<svelte:head>
  <title>Open Brewery DB | {title}</title>
  <meta
    property="og:title"
    content="Open Brewery DB{title ? ` | ${title}` : ''}"
  />
  <meta property="og:image" content={coverImageUrl} />
  <meta property="og:description" content={description} />
</svelte:head>

<article class="markdown">
  <h1>{title}</h1>
  <div>
    <slot />
  </div>
</article>
