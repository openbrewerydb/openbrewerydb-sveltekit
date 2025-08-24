<script lang="ts">
  import type { Component } from 'svelte';
  import { page } from '$app/state';

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

  const siteName = 'OpenBreweryDB';
  const title = $derived(data.post.meta.title ?? 'News • OpenBreweryDB');
  const description = $derived(
    data.post.meta.description ?? 'Updates and stories from OpenBreweryDB.'
  );
  const ogImage = '/obdb-og.png';

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

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="{page.url.origin}{page.url.pathname}" />

  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={page.url.href} />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:image" content={ogImage} />
</svelte:head>

{#if Comp}
  <Comp />
{/if}
