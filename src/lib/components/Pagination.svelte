<script lang="ts">
  let {
    meta,
    country,
    state = undefined,
    city = undefined,
    context = 'country',
    breweryType = undefined,
    onPageChange = undefined,
  } = $props<{
    meta: { page: string; total: string; per_page: string };
    country: string;
    state?: string;
    city?: string;
    context?: 'country' | 'state' | 'city' | 'search';
    breweryType?: string;
    onPageChange?: (page: number) => void;
  }>();

  let page = $derived(+meta.page);
  let totalPages = $derived(Math.ceil(+meta.total / +meta.per_page));

  function handlePageChange(targetPage: number) {
    if (
      onPageChange &&
      targetPage !== page &&
      targetPage >= 1 &&
      targetPage <= totalPages
    ) {
      onPageChange(targetPage);
    }
  }

  const getPageUrl = (targetPage: number): string => {
    if (context === 'search') {
      return '#';
    }

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

  // Calculate the array of pages to display with ellipses
  let visiblePages = $derived.by(() => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5; // Number of pages to show in the sliding window

    if (totalPages <= maxVisible + 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include page 1
      pages.push(1);

      let start = Math.max(2, page - 2);
      let end = Math.min(totalPages - 1, page + 2);

      if (page <= 3) {
        end = 1 + maxVisible;
      } else if (page >= totalPages - 2) {
        start = totalPages - maxVisible;
      }

      if (start > 2) {
        pages.push('ellipsis');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }

      // Always include last page
      pages.push(totalPages);
    }

    return pages;
  });
</script>

{#if totalPages > 1}
  <!-- Mobile-only simple layout (hidden on sm and up) -->
  <div class="flex sm:hidden items-center justify-between mt-4 w-full px-2">
    {#if context === 'search' && onPageChange}
      <button
        class="px-3 py-1.5 border border-amber-300 rounded-md shadow-sm text-xs font-medium text-amber-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-[70px] text-center"
        disabled={page <= 1}
        onclick={() => handlePageChange(page - 1)}
      >
        Previous
      </button>
    {:else}
      <a
        class="px-3 py-1.5 border border-amber-300 rounded-md shadow-sm text-xs font-medium text-amber-700 bg-white min-w-[70px] text-center {page <=
        1
          ? 'opacity-50 pointer-events-none cursor-not-allowed'
          : 'cursor-pointer'}"
        href={page <= 1 ? '#' : getPageUrl(page - 1)}
      >
        Previous
      </a>
    {/if}

    <span class="text-xs text-amber-900 font-medium select-none">
      Page {page} of {totalPages}
    </span>

    {#if context === 'search' && onPageChange}
      <button
        class="px-3 py-1.5 border border-amber-300 rounded-md shadow-sm text-xs font-medium text-amber-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-[70px] text-center"
        disabled={page >= totalPages}
        onclick={() => handlePageChange(page + 1)}
      >
        Next
      </button>
    {:else}
      <a
        class="px-3 py-1.5 border border-amber-300 rounded-md shadow-sm text-xs font-medium text-amber-700 bg-white min-w-[70px] text-center {page >=
        totalPages
          ? 'opacity-50 pointer-events-none cursor-not-allowed'
          : 'cursor-pointer'}"
        href={page >= totalPages ? '#' : getPageUrl(page + 1)}
      >
        Next
      </a>
    {/if}
  </div>

  <!-- Desktop/Tablet layout (hidden on mobile, flex on sm and up) -->
  <div
    class="hidden sm:flex flex-wrap items-center justify-center sm:justify-end gap-2 mt-4"
  >
    <!-- Previous Button -->
    {#if context === 'search' && onPageChange}
      <button
        class="px-4 py-2 border border-amber-300 rounded-md shadow-sm text-sm font-medium text-amber-700 bg-white cursor-pointer hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] text-center"
        disabled={page <= 1}
        onclick={() => handlePageChange(page - 1)}
      >
        Previous
      </button>
    {:else}
      <a
        class="px-4 py-2 border border-amber-300 rounded-md shadow-sm text-sm font-medium text-amber-700 bg-white hover:bg-amber-50 min-w-[80px] text-center {page <=
        1
          ? 'opacity-50 pointer-events-none cursor-not-allowed'
          : 'cursor-pointer'}"
        href={page <= 1 ? '#' : getPageUrl(page - 1)}
      >
        Previous
      </a>
    {/if}

    <!-- Numeric Pages -->
    <div class="flex items-center space-x-1">
      {#each visiblePages as pageItem, i (i)}
        {#if pageItem === 'ellipsis'}
          <span
            class="px-3 py-2 text-amber-800/50 text-sm font-medium select-none"
            >...</span
          >
        {:else if context === 'search' && onPageChange}
          <button
            class="px-4 py-2 border rounded-md shadow-sm text-sm font-medium {pageItem ===
            page
              ? 'bg-amber-600 text-white border-amber-600 font-semibold'
              : 'border-amber-300 text-amber-700 bg-white hover:bg-amber-50 cursor-pointer'}"
            onclick={() => handlePageChange(pageItem)}
          >
            {pageItem}
          </button>
        {:else}
          <a
            class="px-4 py-2 border rounded-md shadow-sm text-sm font-medium {pageItem ===
            page
              ? 'bg-amber-600 text-white border-amber-600 font-semibold'
              : 'border-amber-300 text-amber-700 bg-white hover:bg-amber-50 cursor-pointer'}"
            href={getPageUrl(pageItem)}
          >
            {pageItem}
          </a>
        {/if}
      {/each}
    </div>

    <!-- Next Button -->
    {#if context === 'search' && onPageChange}
      <button
        class="px-4 py-2 border border-amber-300 rounded-md shadow-sm text-sm font-medium text-amber-700 bg-white cursor-pointer hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] text-center"
        disabled={page >= totalPages}
        onclick={() => handlePageChange(page + 1)}
      >
        Next
      </button>
    {:else}
      <a
        class="px-4 py-2 border border-amber-300 rounded-md shadow-sm text-sm font-medium text-amber-700 bg-white hover:bg-amber-50 min-w-[80px] text-center {page >=
        totalPages
          ? 'opacity-50 pointer-events-none cursor-not-allowed'
          : 'cursor-pointer'}"
        href={page >= totalPages ? '#' : getPageUrl(page + 1)}
      >
        Next
      </a>
    {/if}
  </div>
{/if}
