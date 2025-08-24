<script lang="ts">
  import { setContext, getContext } from 'svelte';
  import type { SEOConfig } from './seo';
  import { mergeSEO, SEO_CTX } from './seo';

  interface Props {
    value: SEOConfig;
    children?: import('svelte').Snippet;
  }

  let { value, children }: Props = $props();

  const parent: SEOConfig | undefined = getContext<SEOConfig | undefined>(
    SEO_CTX
  );
  const merged = $derived(mergeSEO(parent, value));

  $effect(() => {
    setContext(SEO_CTX, merged);
  });
</script>

{@render children?.()}
