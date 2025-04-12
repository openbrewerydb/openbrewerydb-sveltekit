<script lang="ts">
  let { meta } = $props();

  let page = $derived(+meta.page);
  let perPage = $derived(+meta.per_page);
  let startOffset = $derived(page === 1 ? 1 : perPage * (page - 1) + 1);
  let total = $derived(+meta.total);
  let window = $derived(perPage * page);
  let endOffset = $derived(window > total ? total : window);
  let totalPages = $derived(Math.ceil(total / perPage));
</script>

<p class="mt-2 text-sm text-gray-700">
  {startOffset} - {endOffset} of {total} breweries (page {page} of {totalPages})
</p>
