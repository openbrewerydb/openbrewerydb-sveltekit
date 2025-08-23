<script lang="ts">
  export let data: {
    posts: Array<{
      href: string;
      meta: {
        title?: string;
        description?: string;
        date?: string;
      };
    }>;
  };
</script>

<section class="mx-auto max-w-3xl px-4 py-8">
  <h1 class="text-3xl font-semibold">OpenBreweryDB Blog</h1>
  <p class="mt-2 text-gray-600">Updates, changelogs, and community stories.</p>

  <ul class="mt-6 space-y-6">
    {#each data.posts as p}
      <li class="border-b border-gray-200 pb-6">
        <a href={p.href} class="block">
          <h2 class="text-xl font-medium hover:underline">{p.meta.title ?? 'Untitled'}</h2>
          {#if p.meta.description}
            <p class="mt-1 text-gray-600">{p.meta.description}</p>
          {/if}
          {#if p.meta.date}
            <p class="mt-1 text-sm text-gray-500">{new Date(p.meta.date).toISOString().replace('T', ' ').replace('Z', ' UTC')}</p>
          {/if}
        </a>
      </li>
    {/each}
  </ul>
</section>
