<script>
  import { goto } from '$app/navigation';

  export let data;

  let selected;
</script>

<div>
  <div class="sm:hidden">
    <label for="tabs" class="sr-only">Select a tab</label>
    <select
      id="tabs"
      name="tabs"
      class="block w-full focus:ring-amber-500 focus:border-amber-500 border-amber-300 rounded-md shadow-sm"
      bind:value={selected}
      on:change={() => {
        goto('#' + selected.id);
      }}
    >
      {#each data as item}
        <option value={item}>{item.label}</option>
      {/each}
    </select>
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
          on:click={() => {
            selected = item;
          }}
        >
          {item.label}
        </a>
      {/each}
    </nav>
  </div>
</div>
