<script lang="ts">
  import Nav from '../components/Nav.svelte';
  import MobileNav from '../components/MobileNav.svelte';

  import '../css/app.css';
  import Footer from '../components/Footer.svelte';

  let showMenu = false;

  function toggleMenu() {
    showMenu = !showMenu;
  }
</script>

<div class="flex flex-col">
  <div class="relative overflow-hidden p-3">
    <div class="relative pt-6 pb-16 sm:pb-24">
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
