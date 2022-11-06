<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import MobileNav from '$lib/components/MobileNav.svelte';
  import Nav from '$lib/components/Nav.svelte';

  import '../css/app.css';

  let showMenu = false;

  function toggleMenu() {
    showMenu = !showMenu;
  }
</script>

<div class="flex flex-col">
  <div class="relative overflow-hidden">
    <div class="relative pt-6">
      <div class="px-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <Nav {toggleMenu} />
          {#if showMenu}
            <MobileNav {toggleMenu} />
          {/if}
        </div>
      </div>
      <main class="mt-12 mx-auto max-w-7xl px-4">
        <slot />
      </main>
    </div>
  </div>
</div>

<Footer />
