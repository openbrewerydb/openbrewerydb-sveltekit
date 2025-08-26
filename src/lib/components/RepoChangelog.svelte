<script lang="ts">
  import ReleaseNotes from '$lib/components/ReleaseNotes.svelte';

  const { repoKey, repo } = $props<{
    repoKey: string;
    repo: {
      type: string;
      source_url: string;
      releases?: Array<{
        tag: string | null;
        title: string | null;
        date: string | null;
        url: string;
        notes?: string | null;
        notes_truncated?: boolean;
      }>;
      fallback?: {
        kind: string;
        items: Array<{
          number: number;
          title: string;
          url: string;
          state: string;
          merged_at?: string | null;
          closed_at?: string | null;
          user?: {
            login: string;
            html_url: string;
            avatar_url?: string;
          } | null;
        }>;
      } | null;
    };
  }>();

  function fmtDate(iso?: string | null) {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
    } catch {
      return iso ?? '';
    }
  }
</script>

<article
  class="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
>
  <header
    class="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center"
  >
    <div>
      <h2 class="text-xl font-semibold text-amber-800">
        <a
          class="hover:underline underline-offset-4 decoration-amber-300 hover:decoration-amber-500"
          href={repo.source_url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {repoKey}
        </a>
      </h2>
      <p class="text-sm text-neutral-600 capitalize">{repo.type}</p>
    </div>
    <a
      class="inline-flex items-center rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      href={repo.source_url}
      target="_blank"
      rel="noopener noreferrer">View on GitHub</a
    >
  </header>

  {#if repo.releases && repo.releases.length}
    <div class="mt-5">
      <h3
        class="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-700"
      >
        Releases
      </h3>
      <ul
        class="divide-y divide-neutral-200 rounded-md border border-amber-100"
      >
        {#each repo.releases as r}
          <li class="p-4 sm:p-5">
            <div
              class="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start"
            >
              <div>
                <a
                  class="font-medium text-amber-800 hover:underline underline-offset-4 decoration-amber-300 hover:decoration-amber-500"
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {r.title || r.tag}
                </a>
                {#if r.date}
                  <div class="text-sm text-neutral-600">{fmtDate(r.date)}</div>
                {/if}
              </div>
              <a
                class="shrink-0 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                href={r.url}
                target="_blank"
                rel="noopener noreferrer">Details</a
              >
            </div>
            {#if r.notes}
              <ReleaseNotes
                text={r.notes}
                truncated={r.notes_truncated ?? false}
              />
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {:else if repo.fallback && repo.fallback.kind === 'pull_requests' && repo.fallback.items.length}
    <div class="mt-5">
      <h3
        class="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-700"
      >
        Recent Closed Pull Requests
      </h3>
      <ul
        class="divide-y divide-neutral-200 rounded-md border border-amber-100"
      >
        {#each repo.fallback.items as pr}
          <li class="p-4 sm:p-5">
            <div
              class="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start"
            >
              <div>
                <a
                  class="font-medium text-amber-800 hover:underline underline-offset-4 decoration-amber-300 hover:decoration-amber-500"
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  #{pr.number}: {pr.title}
                </a>
                <div class="text-sm text-neutral-600">
                  {pr.merged_at ? 'Merged' : 'Closed'}
                  {fmtDate(pr.merged_at || pr.closed_at)}
                  {#if pr.user}
                    · by
                    <a
                      class="text-amber-800 hover:underline underline-offset-4 decoration-amber-300 hover:decoration-amber-500"
                      href={pr.user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{pr.user.login}
                    </a>
                  {/if}
                </div>
              </div>
              <a
                class="shrink-0 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer">View PR</a
              >
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {:else}
    <p class="mt-5 text-sm text-neutral-600">
      No recent releases or PRs found.
    </p>
  {/if}
</article>
