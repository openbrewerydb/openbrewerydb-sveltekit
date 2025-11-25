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
        class="block w-full text-base md:text-lg font-medium bg-white text-amber-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 border-2 border-amber-400 rounded-lg py-2.5 pl-3 pr-10 appearance-none shadow-md hover:shadow-lg cursor-pointer transition-colors transition-shadow duration-150"
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
    <nav class="flex flex-wrap gap-2" aria-label="Tabs">
      {#each data as item}
        <a
          href="#{item.id}"
          class="inline-flex items-center px-4 py-2 font-semibold text-sm rounded-full border shadow-sm hover:shadow-md transition-colors transition-shadow duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 {selected ===
          item
            ? 'bg-amber-600 border-amber-600 text-white'
            : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300'}"
          onclick={() => {
            selected = item;
          }}
          aria-current={selected === item ? 'page' : undefined}
        >
          {item.label}
        </a>
      {/each}
    </nav>
  </div>
</div>
