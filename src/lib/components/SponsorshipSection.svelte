<script lang="ts">
  import SentryLogo from './SentryLogo.svelte';
</script>

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
      <SentryLogo />
    </span>
  </a>
</section>
