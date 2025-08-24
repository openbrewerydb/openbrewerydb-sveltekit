<script lang="ts">
  import type { Component } from 'svelte';

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

  $effect(() => {
    (async () => {
      const loader = modules[data.post.path];
      if (loader) {
        const m = await loader();
        Comp = (m as any).default as Component;
      } else {
        Comp = null;
      }
    })();
  });
</script>

{#if Comp}
  <Comp />
{/if}
