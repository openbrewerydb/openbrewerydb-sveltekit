<script lang="ts">
  import authorsMapRaw from '$lib/data/github-authors.json';

  let { authors, date }: { authors?: string[]; date?: string } = $props();

  type AuthorProfile = {
    login: string;
    name: string | null;
    avatar_url: string;
    html_url: string;
    bio: string | null;
  };

  const authorsMap = authorsMapRaw as Record<string, AuthorProfile>;

  function formatLocalDateTime(datetime: string) {
    const d = new Date(datetime);
    return d.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }
</script>

<div
  class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500"
>
  {#if authors.length}
    <div class="flex items-center gap-2">
      {#each authors as u}
        {#if authorsMap[u]}
          <a
            href={authorsMap[u].html_url}
            target="_blank"
            rel="noreferrer"
            class="flex items-center gap-1 hover:text-gray-700"
          >
            <img
              src={authorsMap[u].avatar_url}
              alt={authorsMap[u].login}
              class="h-5 w-5 rounded-full"
            />
            <span>{authorsMap[u].name ?? authorsMap[u].login}</span>
          </a>
        {:else}
          <span>{u}</span>
        {/if}
      {/each}
    </div>
  {/if}
  {#if date}
    <div class="flex items-center">
      <span>{formatLocalDateTime(date)}</span>
    </div>
  {/if}
</div>
