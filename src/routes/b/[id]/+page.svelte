<script>
  /** @type {import('./$types').PageData} */
  export let data;

  $: brewery = data.brewery;
</script>

<svelte:head>
  <meta property="og:title" content={`Open Brewery DB - ${brewery.name}`} />
  <meta
    property="og:description"
    content={`${brewery.name}, ${brewery.city}, ${
      brewery.county_province ? brewery.county_province : brewery.state
    }`}
  />
</svelte:head>

<h1 class="text-4xl my-4">{brewery.name}</h1>
