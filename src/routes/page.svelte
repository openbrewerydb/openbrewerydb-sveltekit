<script>
  export let title;
  export let coverImageUrl;
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
  <meta property="og:image" content={coverImageUrl} />
</svelte:head>

<article class="markdown">
  <h1>{title}</h1>
  <div>
    <slot />
  </div>
</article>
