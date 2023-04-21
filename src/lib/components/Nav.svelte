<script lang="ts">
  import smallLogo from '$lib/assets/obdb-logo-sm.png';
  import NavMenuItem from './NavMenuItem.svelte';

  export let toggleMenu: () => void;
</script>

<nav
  class="relative flex items-center justify-between sm:h-10 md:justify-center"
  aria-label="Global"
>
  <div class="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
    <div class="flex items-center justify-between w-full md:w-auto">
      <a href="/">
        <span class="sr-only">Open Brewery DB</span>
        <img
          class="h-12 w-auto sm:h-16"
          src={smallLogo}
          alt="Open Brewery DB Logo"
        />
      </a>
      <div class="-mr-2 flex items-center md:hidden">
        <button
          on:click={toggleMenu}
          type="button"
          class="bg-amber-200 rounded-md p-2 inline-flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <!-- Heroicon name: outline/menu -->
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
  <div class="hidden md:flex md:space-x-10">
    <NavMenuItem href="/breweries">Breweries</NavMenuItem>
    <NavMenuItem href="/documentation">Docs</NavMenuItem>
    <NavMenuItem href="/faq">FAQ</NavMenuItem>
    <NavMenuItem href="/projects">Projects</NavMenuItem>
    <NavMenuItem href="/about">About</NavMenuItem>
  </div>
  <div
    class="hidden md:absolute md:flex md:items-center md:justify-end md:inset-y-0 md:right-0"
  >
    <span class="inline-flex rounded-md shadow">
      <a
        href="http://eepurl.com/dBjS0j"
        class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-yellow-600 bg-white hover:bg-gray-50"
      >
        Newsletter Signup
      </a>
    </span>
  </div>
</nav>
