<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import MobileNav from '$lib/components/MobileNav.svelte';
  import Nav from '$lib/components/Nav.svelte';
  import '../styles/tailwind.css';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  let showMenu: boolean = $state(false);

  // Move function declaration to top level to fix ESLint error
  const toggleMenu = () => {
    showMenu = !showMenu;
  };
</script>

<svelte:head>
  <meta property="og:type" content="article" />
  <meta
    property="og:image"
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
        {@render children?.()}
      </main>
    </div>
  </div>
</div>

<Footer />
