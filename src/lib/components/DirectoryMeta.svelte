<script lang="ts">
  export let meta;

  $: page = +meta.page;
  $: perPage = +meta.per_page;
  $: startOffset = page === 1 ? 1 : perPage * (page - 1) + 1;
  $: total = +meta.total;
  $: window = perPage * page;
  $: endOffset = window > total ? total : window;
  $: totalPages = Math.ceil(total / perPage);
</script>

<p class="mt-2 text-sm text-gray-700">
  {startOffset} - {endOffset} of {total} breweries (page {page} of {totalPages})
</p>
