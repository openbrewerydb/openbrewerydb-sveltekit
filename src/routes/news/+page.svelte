<script lang="ts">
  import { formatLocalDateTime } from '$lib/utils';
  import SEO from '$lib/components/SEO.svelte';

  const { data } = $props<{
    data: {
      posts: Array<{
        href: string;
        meta: { title?: string; description?: string; date?: string };
      }>;
    };
  }>();

  const title = 'News';
  const description =
    'Updates, changelogs, and community stories from OpenBreweryDB.';
</script>

<SEO {title} {description} />

<section class="mx-auto max-w-3xl px-4 py-8">
  <h1 class="text-3xl font-semibold">OpenBreweryDB News</h1>
  <p class="mt-2 text-gray-600">Updates, changelogs, and community stories.</p>

  <ul class="mt-6 space-y-6">
    {#each data.posts as p (p.href)}
      <li class="border-b border-gray-200 pb-6">
        <a href={p.href} class="block">
          <h2 class="text-xl font-medium hover:underline">
            {p.meta.title ?? 'Untitled'}
          </h2>
          {#if p.meta.description}
            <p class="mt-1 text-gray-600">{p.meta.description}</p>
          {/if}
          {#if p.meta.date}
            <p class="mt-1 text-sm text-gray-500">
              {formatLocalDateTime(p.meta.date)}
            </p>
          {/if}
        </a>
      </li>
    {/each}
  </ul>
</section>
