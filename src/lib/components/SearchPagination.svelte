<script lang="ts">
  let { currentPage, totalPages, hasPrevious, hasNext, onPageChange } = $props<{
    currentPage: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
    onPageChange: (page: number) => void;
  }>();

  function handlePageChange(targetPage: number) {
    if (
      targetPage !== currentPage &&
      targetPage >= 1 &&
      targetPage <= totalPages
    ) {
      onPageChange?.(targetPage);
    }
  }

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

      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);

      if (currentPage <= 3) {
        end = 1 + maxVisible;
      } else if (currentPage >= totalPages - 2) {
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
  <div class="flex justify-center items-center space-x-2">
    <button
      class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!hasPrevious}
      onclick={() => handlePageChange(currentPage - 1)}
    >
      Previous
    </button>

    <div class="flex items-center space-x-1">
      {#each visiblePages as pageItem, i (i)}
        {#if pageItem === 'ellipsis'}
          <span class="px-3 py-2 text-gray-500 text-sm font-medium select-none"
            >...</span
          >
        {:else}
          <button
            class="px-4 py-2 border rounded-md shadow-sm text-sm font-medium {pageItem ===
            currentPage
              ? 'bg-amber-600 text-white border-amber-600'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 cursor-pointer'}"
            onclick={() => handlePageChange(pageItem)}
          >
            {pageItem}
          </button>
        {/if}
      {/each}
    </div>

    <button
      class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!hasNext}
      onclick={() => handlePageChange(currentPage + 1)}
    >
      Next
    </button>
  </div>
{/if}
