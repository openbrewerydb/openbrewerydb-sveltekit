<script lang="ts">
  let {
    meta,
    country,
    state = undefined,
    city = undefined,
    context = 'country',
    breweryType = undefined,
  } = $props();

  let page = $derived(+meta.page);

  const getPageUrl = (targetPage: number): string => {
    let baseUrl = `/breweries/${country}`;

    if (context === 'state' || context === 'city') {
      baseUrl += `/${state}`;
    }

    if (context === 'city') {
      baseUrl += `/${city}`;
    }

    baseUrl += `/${targetPage}`;

    if (breweryType) {
      baseUrl += `?by_type=${breweryType}`;
    }

    return baseUrl;
  };
</script>

<div
  class="mt-4 flex flex-wrap items-center justify-center sm:justify-end gap-3"
>
  {#if page > 1}
    <a
      class="px-5 py-3 border border-amber-300 rounded-md text-amber-700 hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 shadow-sm hover:shadow transition-shadow duration-200 text-sm font-medium min-w-[100px] text-center"
      href={getPageUrl(page - 1)}>Previous</a
    >
  {/if}

  <span class="text-sm text-gray-600 px-2">
    Page {page} of {Math.ceil(+meta.total / +meta.per_page)}
  </span>

  {#if page < +meta.total / +meta.per_page}
    <a
      class="px-5 py-3 border border-amber-300 rounded-md text-amber-700 hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 shadow-sm hover:shadow transition-shadow duration-200 text-sm font-medium min-w-[100px] text-center"
      href={getPageUrl(page + 1)}>Next</a
    >
  {/if}
</div>
