<script>
  /** @type {import('./$types').PageData} */
  export let data;

  $: brewery = data.brewery;
</script>

<h1 class="text-4xl my-4">{brewery.name}</h1>
