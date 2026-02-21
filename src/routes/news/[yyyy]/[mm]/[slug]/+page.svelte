<script lang="ts">
  import type { Component } from 'svelte';
  import SEO from '$lib/components/SEO.svelte';

  interface Props {
    data: {
      post: {
        path: string;
        meta: {
          title?: string;
          description?: string;
          date?: string;
          author?: string;
          authors?: string[];
        };
      };
    };
  }

  let { data }: Props = $props();

  const modules = import.meta.glob('/src/lib/data/posts/**/*.{md,svx}');
  let Comp: Component | null = $state(null);

  const title = $derived(data.post.meta.title ?? 'News');
  const description = $derived(
    data.post.meta.description ?? 'Updates and stories from OpenBreweryDB.'
  );

  $effect(() => {
    (async () => {
      const loader = modules[data.post.path];
      if (loader) {
        const m = await loader();
        Comp = (m as { default: Component }).default;
      } else {
        Comp = null;
      }
    })();
  });
</script>

<SEO {title} {description} type="article" image="/obdb-og.png" />

{#if Comp}
  <Comp />
{/if}
