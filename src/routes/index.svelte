<script lang="ts">
  import NewsletterForm from '../components/NewsletterForm.svelte';
  import logo from '../../static/obdb-logo.png';
</script>

<svelte:head>
  <title>Open Brewery DB</title>
  <meta property="og:title" content="Open Brewery DB" />
  <meta
    property="og:description"
    content="A worldwide open-source brewery dataset and API"
  />
  <meta property="og:image" content="/obdb-og.png" />
</svelte:head>

<div class="text-center">
  <div class="w-full sm:w-96 mx-auto my-6">
    <img class="" src={logo} alt="Open Brewery DB Logo" />
  </div>
  <h1
    class="text-2xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
  >
    <span class="block xl:inline">Free and open-source</span>
    <span class="block text-yellow-600 xl:inline">brewery data</span>
  </h1>
  <p
    class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
  >
    Open Brewery DB is a free dataset and API with public information on
    breweries, cideries, brewpubs, and bottleshops.
  </p>
  <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
    <div class="rounded-md shadow">
      <a
        href="/docs"
        class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 md:py-4 md:text-lg md:px-10"
      >
        Read API Documentation
      </a>
    </div>
  </div>
  <div class="mt-12">
    <h2
      class="mt-6 tracking-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl"
    >
      The Goal
    </h2>
    <p
      class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-3 md:text-xl md:max-w-3xl"
    >
      The goal of Open Brewery DB is to maintain an open-source,
      community-driven dataset and provide a public API for brewery-related
      data.
    </p>
    <h2
      class="mt-6 tracking-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl"
    >
      The Mission
    </h2>
    <p
      class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-3 md:text-xl md:max-w-3xl"
    >
      It is our belief that public information should be freely accessible for
      the betterment of the community and the happiness of web developers and
      data analysts.
    </p>
  </div>
</div>

<div class="md:max-w-md mx-auto mt-10">
  <NewsletterForm />
</div>
