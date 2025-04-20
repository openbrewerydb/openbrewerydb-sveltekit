<script lang="ts">
  import { goto } from '$app/navigation';
  import { ChevronDown } from 'lucide-svelte';

  export type NavTab = {
    id: string;
    label: string;
  };

  let { data }: { data: NavTab[] } = $props();
  let selected: NavTab = $state();
</script>

<div>
  <div
    class="sm:hidden sticky top-0 bg-amber-50 py-3 px-2 border-b border-amber-200 shadow-sm"
  >
    <div class="relative">
      <label for="tabs" class="block text-amber-700 font-medium mb-1 text-sm"
        >Jump to section</label
      >
      <select
        id="tabs"
        name="tabs"
        class="block w-full text-lg font-medium bg-white text-amber-800 focus:ring-amber-500 focus:border-amber-500 border-2 border-amber-400 rounded-lg py-2.5 px-3 appearance-none shadow-md"
        bind:value={selected}
        onchange={() => {
          goto('#' + selected.id);
        }}
      >
        {#each data as item}
          <option value={item} class="py-1">{item.label}</option>
        {/each}
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 mt-6"
      >
        <ChevronDown class="h-5 w-5 text-amber-500" aria-hidden="true" />
      </div>
    </div>
  </div>
  <div class="hidden sm:block">
    <nav class="flex space-x-4" aria-label="Tabs">
      {#each data as item}
        <a
          href="#{item.id}"
          class="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md shadow-sm hover:shadow transition-shadow duration-200 {selected ===
          item
            ? 'bg-amber-100 text-amber-700'
            : 'text-amber-500 hover:text-amber-700'}"
          onclick={() => {
            selected = item;
          }}
        >
          {item.label}
        </a>
      {/each}
    </nav>
  </div>
</div>
