<script lang="ts">
  import { run } from 'svelte/legacy';

  import debounce from 'just-debounce';
  import { breweries } from '$lib/stores';

  let searchInput = $state('');

  const handleInput = debounce(
    (
      event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }
    ) => {
      searchInput = event.currentTarget.value;
    },
    300
  );

  // Move function declaration to top level to fix ESLint error
  const fetchBreweries = async (query: string) => {
    console.log(query);
  };

  run(() => {
    if (searchInput) {
      fetchBreweries(searchInput);
    }
  });
</script>

<div>
  <label for="combobox" class="block text-sm font-medium text-gray-700"
    >Search Breweries...</label
  >
  <div class="relative mt-1">
    <input
      id="combobox"
      type="text"
      class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-12 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:text-sm"
      role="combobox"
      aria-controls="options"
      aria-expanded="false"
      onkeyup={handleInput}
    />
    <button
      type="button"
      class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
    >
      <!-- Heroicon name: mini/chevron-up-down -->
      <svg
        class="h-5 w-5 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    {#if $breweries.length}
      <ul
        class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        id="options"
        role="listbox"
      >
        {#each $breweries as brewery, i}
          <li
            class="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:text-white hover:bg-amber-600 transition-colors duration-150"
            id="option-{i}"
            role="option"
            tabindex="-1"
            aria-selected="false"
          >
            <div class="flex">
              <span class="truncate hover:font-semibold">{brewery.name}</span>
              <span class="ml-2 truncate text-gray-500 group-hover:text-amber-200"
                >{brewery.city}, {brewery.state_province}, {brewery.country}</span
              >
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
