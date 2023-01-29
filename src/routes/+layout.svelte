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

<svelte:head>
  <title>Open Brewery DB</title>

  <meta property="og:type" content="article" />
  <meta property="og:title" content="Open Brewery DB" />
  <meta
    property="og:description"
    content="A worldwide open-source brewery dataset and API"
  />
  <meta
    property="og:image"
    content="https://www.openbrewerydb.org/obdb-og.png"
  />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@openbrewerydb" />
  <meta name="twitter:title" content="Open Brewery DB" />
  <meta
    name="twitter:description"
    content="A worldwide open-source brewery dataset and API"
  />
  <meta
    name="twitter:image"
    content="https://www.openbrewerydb.org/obdb-og.png"
  />
</svelte:head>

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
