<script lang="ts">
  import logo from '$lib/assets/obdb-logo.png';
</script>

<svelte:head>
  <title>Open Brewery DB</title>

  <meta property="og:title" content="Open Brewery DB" />
  <meta
    property="og:description"
    content="A worldwide open-source brewery dataset and API"
  />
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
        href="/documentation"
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
  <section
    class="w-full m-auto max-w-xl flex flex-col items-center mt-2"
    aria-labelledby="sponsorship-title"
  >
    <h2
      id="sponsorship-title"
      class="mt-6 tracking-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl"
    >
      Sponsorship
    </h2>
    <p
      class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-3 md:text-xl md:max-w-3xl"
    >
      Open Brewery DB is grateful for the support of our sponsors.
    </p>
    <a
      href="https://sentry.io/welcome/"
      target="_blank"
      rel="noopener noreferrer"
      class="flex flex-col items-center group mt-3"
      aria-label="Sentry - Application Monitoring Platform"
      data-testid="sentry-sponsorship"
    >
      <span class="mb-2">
        <svg
          class="w-40 sm:w-48 h-auto"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 222 66"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M29,2.26a4.67,4.67,0,0,0-8,0L14.42,13.53A32.21,32.21,0,0,1,32.17,40.19H27.55A27.68,27.68,0,0,0,12.09,17.47L6,28a15.92,15.92,0,0,1,9.23,12.17H4.62A.76.76,0,0,1,4,39.06l2.94-5a10.74,10.74,0,0,0-3.36-1.9l-2.91,5a4.54,4.54,0,0,0,1.69,6.24A4.66,4.66,0,0,0,4.62,44H19.15a19.4,19.4,0,0,0-8-17.31l2.31-4A23.87,23.87,0,0,1,23.76,44H36.07a35.88,35.88,0,0,0-16.41-31.8l4.67-8a.77.77,0,0,1,1.05-.27c.53.29,20.29,34.77,20.66,35.17a.76.76,0,0,1-.68,1.13H40.6q.09,1.91,0,3.81h4.78A4.59,4.59,0,0,0,50,39.43a4.49,4.49,0,0,0-.62-2.28Z M124.32,28.28,109.56,9.22h-3.68V34.77h3.73V15.19l15.18,19.58h3.26V9.22h-3.73ZM87.15,23.54h13.23V20.22H87.14V12.53h14.93V9.21H83.34V34.77h18.92V31.45H87.14ZM71.59,20.3h0C66.44,19.06,65,18.08,65,15.7c0-2.14,1.89-3.59,4.71-3.59a12.06,12.06,0,0,1,7.07,2.55l2-2.83a14.1,14.1,0,0,0-9-3c-5.06,0-8.59,3-8.59,7.27,0,4.6,3,6.19,8.46,7.52C74.51,24.74,76,25.78,76,28.11s-2,3.77-5.09,3.77a12.34,12.34,0,0,1-8.3-3.26l-2.25,2.69a15.94,15.94,0,0,0,10.42,3.85c5.48,0,9-2.95,9-7.51C79.75,23.79,77.47,21.72,71.59,20.3ZM195.7,9.22l-7.69,12-7.64-12h-4.46L186,24.67V34.78h3.84V24.55L200,9.22Zm-64.63,3.46h8.37v22.1h3.84V12.68h8.37V9.22H131.08ZM169.41,24.8c3.86-1.07,6-3.77,6-7.63,0-4.91-3.59-8-9.38-8H154.67V34.76h3.8V25.58h6.45l6.48,9.2h4.44l-7-9.82Zm-10.95-2.5V12.6h7.17c3.74,0,5.88,1.77,5.88,4.84s-2.29,4.86-5.84,4.86Z"
            transform="translate(11, 11)"
          ></path>
        </svg>
      </span>
    </a>
  </section>
</div>
