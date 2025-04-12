<script lang="ts">
  import { fade } from 'svelte/transition';
  import NavMenuItem from './NavMenuItem.svelte';

  export let toggleMenu: () => void;
</script>

<div
  transition:fade
  class="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
>
  <div
    class="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden"
  >
    <div class="px-5 pt-4 flex items-center justify-end">
      <div class="-mr-2">
        <button
          on:click={toggleMenu}
          type="button"
          class="bg-white rounded-md p-2 inline-flex items-center justify-center text-amber-600 hover:text-amber-800 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 shadow-sm hover:shadow transition-shadow duration-200"
        >
          <span class="sr-only">Close menu</span>
          <!-- Heroicon name: outline/x -->
          <svg
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="px-2 pt-2 pb-3">
      <NavMenuItem href="/" {toggleMenu} isMobile={true}>Home</NavMenuItem>
      <NavMenuItem href="/breweries" {toggleMenu} isMobile={true}
        >Breweries</NavMenuItem
      >
      <NavMenuItem href="/documentation" {toggleMenu} isMobile={true}
        >Docs</NavMenuItem
      >
      <NavMenuItem href="/faq" {toggleMenu} isMobile={true}>FAQ</NavMenuItem>
      <NavMenuItem href="/projects" {toggleMenu} isMobile={true}
        >Projects</NavMenuItem
      >
      <NavMenuItem href="/about" {toggleMenu} isMobile={true}>About</NavMenuItem
      >
    </div>
    <NavMenuItem
      href="http://eepurl.com/dBjS0j"
      {toggleMenu}
      class="block w-full px-5 py-3 text-center font-medium text-amber-600 bg-gray-50 hover:bg-gray-100 shadow-sm hover:shadow transition-shadow duration-200"
    >
      Newsletter Signup
    </NavMenuItem>
  </div>
</div>
