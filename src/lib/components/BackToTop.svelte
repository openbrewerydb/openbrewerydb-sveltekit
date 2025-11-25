<script lang="ts">
  import { ArrowUp } from 'lucide-svelte';
  import { onMount } from 'svelte';

  interface Props {
    /**
     * Number of pixels scrolled before the button becomes visible.
     */
    threshold?: number;

    /**
     * Accessible label for screen readers.
     */
    ariaLabel?: string;
  }

  let { threshold = 320, ariaLabel = 'Back to top' }: Props = $props();

  let isVisible = $state(false);

  const handleScroll = () => {
    if (typeof window === 'undefined') return;
    isVisible = window.scrollY > threshold;
  };

  const scrollToTop = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  onMount(() => {
    if (typeof window === 'undefined') return;

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

{#if isVisible}
  <button
    type="button"
    onclick={scrollToTop}
    class="fixed bottom-4 right-4 md:bottom-8 md:right-8 inline-flex items-center justify-center rounded-full bg-amber-600 text-white shadow-md hover:bg-amber-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 p-3 md:p-4 transition-transform transition-shadow transition-colors duration-200"
    aria-label={ariaLabel}
  >
    <ArrowUp class="h-5 w-5" aria-hidden="true" />
    <span class="sr-only">{ariaLabel}</span>
  </button>
{/if}
