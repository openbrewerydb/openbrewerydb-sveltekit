<script lang="ts">
  import { formatLocalDateTime } from '$lib/utils';
  import { page } from '$app/state';

  const { data } = $props<{
    data: {
      posts: Array<{
        href: string;
        meta: { title?: string; description?: string; date?: string };
      }>;
    };
  }>();

  const siteName = 'OpenBreweryDB';
  const title = 'News • OpenBreweryDB';
  const description =
    'Updates, changelogs, and community stories from OpenBreweryDB.';
  const ogImage = '/obdb-og.png';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="{page.url.origin}{page.url.pathname}" />

  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={page.url.href} />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:image" content={ogImage} />
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-8">
  <h1 class="text-3xl font-semibold">OpenBreweryDB News</h1>
  <p class="mt-2 text-gray-600">Updates, changelogs, and community stories.</p>

  <ul class="mt-6 space-y-6">
    {#each data.posts as p}
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
