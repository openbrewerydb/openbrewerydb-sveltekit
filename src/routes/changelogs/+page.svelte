<script>
  import changelogs from '$lib/data/changelogs.json';

  // Svelte 5 runes
  const entries = $derived(Object.entries(changelogs.repos || {}));

  function fmtDate(iso) {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    } catch {
      return iso;
    }
  }
</script>

<svelte:head>
  <title>Changelogs • OpenBreweryDB</title>
  <meta name="description" content="Latest releases and recent closed pull requests for the OpenBreweryDB dataset and API." />
</svelte:head>

<section class="mx-auto max-w-4xl px-4 py-8 sm:py-10">
  <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Changelogs</h1>
  <p class="mt-2 text-base text-neutral-600">
    Release notes and recent changes for the dataset and API.
  </p>

  <div class="mt-8 space-y-10">
    {#each entries as [key, repo]}
      <article class="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <header class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-semibold">
              <a class="hover:underline" href={repo.source_url} rel="noopener noreferrer" target="_blank">
                {key}
              </a>
            </h2>
            <p class="text-sm text-neutral-600 capitalize">{repo.type}</p>
          </div>
          <a
            class="inline-flex items-center rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
            href={repo.source_url}
            target="_blank"
            rel="noopener noreferrer"
            >View on GitHub</a
          >
        </header>

        {#if repo.releases && repo.releases.length}
          <div class="mt-5">
            <h3 class="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-600">Releases</h3>
            <ul class="divide-y divide-neutral-200 rounded-md border border-neutral-200">
              {#each repo.releases as r}
                <li class="p-4">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <a class="font-medium hover:underline" href={r.url} target="_blank" rel="noopener noreferrer">
                        {r.title || r.tag}
                      </a>
                      {#if r.date}
                        <div class="text-sm text-neutral-600">{fmtDate(r.date)}</div>
                      {/if}
                    </div>
                    <a
                      class="shrink-0 rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50"
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      >Details</a
                    >
                  </div>
                  {#if r.notes}
                    <p class="mt-3 text-sm text-neutral-700">{r.notes}{r.notes_truncated ? '…' : ''}</p>
                  {/if}
                </li>
              {/each}
            </ul>
          </div>
        {:else if repo.fallback && repo.fallback.kind === 'pull_requests' && repo.fallback.items.length}
          <div class="mt-5">
            <h3 class="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-600">Recent Closed Pull Requests</h3>
            <ul class="divide-y divide-neutral-200 rounded-md border border-neutral-200">
              {#each repo.fallback.items as pr}
                <li class="p-4">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <a class="font-medium hover:underline" href={pr.url} target="_blank" rel="noopener noreferrer">
                        #{pr.number}: {pr.title}
                      </a>
                      <div class="text-sm text-neutral-600">
                        {pr.merged_at ? 'Merged' : 'Closed'} {fmtDate(pr.merged_at || pr.closed_at)}
                        {#if pr.user}
                          · by
                          <a class="hover:underline" href={pr.user.html_url} target="_blank" rel="noopener noreferrer">
                            @{pr.user.login}
                          </a>
                        {/if}
                      </div>
                    </div>
                    <a
                      class="shrink-0 rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50"
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      >View PR</a
                    >
                  </div>
                </li>
              {/each}
            </ul>
          </div>
        {:else}
          <p class="mt-5 text-sm text-neutral-600">No recent releases or PRs found.</p>
        {/if}
      </article>
    {/each}
  </div>
</section>
