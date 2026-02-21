<script lang="ts">
  import { Search } from 'lucide-svelte';

  let { onSearch, initialQuery = '' } = $props<{
    onSearch: (query: string) => Promise<void>;
    initialQuery?: string;
  }>();

  let query = $state('');

  $effect(() => {
    query = initialQuery;
  });

  function handleSearch(event: SubmitEvent) {
    event.preventDefault();
    onSearch(query);
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    query = target.value;
    if (query.length === 0) {
        onSearch('');
    }
  }
</script>

<div class="shadow rounded-lg mb-6 border-transparent">
  <form onsubmit={handleSearch} class="flex gap-0">
    <input
      type="search"
      name="query"
      class="w-full p-4 bg-white rounded-l-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
      placeholder="Search for a brewery..."
      bind:value={query}
      oninput={handleInput}
    />
    <button
      type="submit"
      class="inline-flex p-4 items-center border border-transparent text-sm font-medium rounded-r-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 cursor-pointer"
    >
      <Search size={16} class="mr-2" />
      Search
    </button>
  </form>
</div>
