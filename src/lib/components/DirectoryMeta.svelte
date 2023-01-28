<script lang="ts">
  export let meta;

  $: console.log({ meta });

  $: page = +meta.page;
  $: perPage = +meta.per_page;
  $: total = +meta.total;
  $: totalPages = Math.ceil(total / perPage);
</script>

<p class="mt-2 text-sm text-gray-700">
  {perPage}
  breweries per page of {total} (page {page} of {totalPages})
</p>
