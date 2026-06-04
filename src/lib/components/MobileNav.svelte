<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import NavMenuItem from './NavMenuItem.svelte';

  interface Props {
    toggleMenu: () => void;
  }

  let { toggleMenu }: Props = $props();
</script>

<!-- Backdrop overlay -->
<div
  transition:fade={{ duration: 200 }}
  class="fixed inset-0 bg-black/50 z-40 md:hidden"
  onclick={toggleMenu}
  aria-hidden="true"
></div>

<!-- Slide-in menu panel -->
<div
  transition:fly={{ x: 300, duration: 300, easing: (t) => t * (2 - t) }}
  class="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl md:hidden flex flex-col"
>
  <!-- Header with close button -->
  <div
    class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-amber-100/60"
  >
    <span class="text-lg font-bold text-amber-950">Menu</span>
    <button
      onclick={toggleMenu}
      type="button"
      class="rounded-md p-2 inline-flex items-center justify-center text-amber-800 hover:text-amber-950 hover:bg-amber-200/80 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-600 transition-colors duration-200"
    >
      <span class="sr-only">Close menu</span>
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

  <!-- Menu items -->
  <div class="flex-1 overflow-y-auto px-4 py-6">
    <div class="grid grid-cols-1 gap-2">
      <NavMenuItem href="/" {toggleMenu} isMobile={true}>Home</NavMenuItem>
      <NavMenuItem href="/breweries" {toggleMenu} isMobile={true}
        >Breweries</NavMenuItem
      >
      <NavMenuItem href="/documentation" {toggleMenu} isMobile={true}
        >Docs</NavMenuItem
      >
      <NavMenuItem href="/faq" {toggleMenu} isMobile={true}>FAQ</NavMenuItem>
      <NavMenuItem href="/news" {toggleMenu} isMobile={true}>News</NavMenuItem>
      <NavMenuItem href="/changelogs" {toggleMenu} isMobile={true}
        >Changelogs</NavMenuItem
      >
      <NavMenuItem href="/projects" {toggleMenu} isMobile={true}
        >Projects</NavMenuItem
      >
      <NavMenuItem href="/about" {toggleMenu} isMobile={true}>About</NavMenuItem
      >
    </div>
  </div>
</div>
