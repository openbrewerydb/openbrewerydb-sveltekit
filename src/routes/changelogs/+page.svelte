<script>
  import changelogs from '$lib/data/changelogs.json';
  import RepoChangelog from '$lib/components/RepoChangelog.svelte';

  // Svelte 5 runes
  const entries = $derived(Object.entries(changelogs.repos || {}));
</script>

<svelte:head>
  <title>Changelogs • OpenBreweryDB</title>
  <meta
    name="description"
    content="Latest releases and recent closed pull requests for the OpenBreweryDB dataset and API."
  />
</svelte:head>

<section class="mx-auto max-w-4xl px-4 py-8 sm:py-10">
  <h1 class="text-3xl font-bold tracking-tight text-amber-900 sm:text-4xl">Changelogs</h1>
  <p class="mt-2 text-base text-neutral-700">
    Release notes and recent changes for the dataset and API.
  </p>

  <div class="mt-6 border-t border-amber-100 pt-6 sm:mt-8 sm:pt-8 space-y-8 sm:space-y-10">
    {#each entries as [key, repo]}
      <RepoChangelog repoKey={key} {repo} />
    {/each}
  </div>
</section>
