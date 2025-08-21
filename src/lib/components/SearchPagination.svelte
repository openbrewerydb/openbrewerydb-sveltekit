<script lang="ts">
  let {
    currentPage,
    totalPages,
    hasPrevious,
    hasNext,
    onPageChange,
    maxPagesToShow = 10,
  } = $props<{
    currentPage: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
    onPageChange: (page: number) => void;
    maxPagesToShow?: number;
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
</script>

{#if totalPages > 1}
  <div class="flex justify-center mt-8 space-x-2">
    <button
      class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!hasPrevious}
      onclick={() => handlePageChange(currentPage - 1)}
    >
      Previous
    </button>

    <div class="flex space-x-1">
      {#each Array(Math.min(totalPages, maxPagesToShow)) as _, i}
        {@const pageNum = i + 1}
        <button
          class="px-4 py-2 border rounded-md shadow-sm text-sm font-medium {pageNum ===
          currentPage
            ? 'bg-amber-600 text-white border-amber-600'
            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}"
          onclick={() => handlePageChange(pageNum)}
        >
          {pageNum}
        </button>
      {/each}
    </div>

    <button
      class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!hasNext}
      onclick={() => handlePageChange(currentPage + 1)}
    >
      Next
    </button>
  </div>
{/if}
