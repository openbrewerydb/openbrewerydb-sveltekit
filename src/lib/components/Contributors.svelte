<script lang="ts">
  import contributorsData from '$lib/data/contributors.json';

  interface Contributor {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    contributions: number;
  }

  const contributors: Contributor[] = contributorsData.contributors;
  const contributorsCount = contributorsData.count;
</script>

<section
  class="mt-16 max-w-6xl mx-auto px-4"
  aria-labelledby="contributors-title"
>
  <h2
    id="contributors-title"
    class="text-3xl font-extrabold text-gray-900 text-center mb-8"
  >
    Contributors 🍻
  </h2>

  <div
    class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-4 mb-6"
  >
    {#each contributors as contributor}
      <a
        href={contributor.html_url}
        target="_blank"
        rel="noopener noreferrer"
        class="group relative inline-block w-12 h-12 sm:w-14 sm:h-14 bg-gray-300 rounded-full"
        title={`${contributor.login} (${contributor.contributions} contributions)`}
      >
        <img
          src={contributor.avatar_url}
          alt={contributor.login}
          class="w-full h-full rounded-full border-2 border-gray-200 group-hover:border-amber-400 transition-colors duration-200"
          loading="eager"
          decoding="async"
        />
      </a>
    {/each}
  </div>

  <div class="text-center">
    <p class="text-gray-600 text-sm mb-4">
      {contributorsCount} amazing contributors making this project possible
    </p>
    <a
      href="https://github.com/openbrewerydb/openbrewerydb/graphs/contributors"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors duration-200"
    >
      View all contributors
      <svg
        class="ml-1 w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        ></path>
      </svg>
    </a>
  </div>
</section>
