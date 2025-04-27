<script lang="ts">
  import {
    MapPinIcon,
    PhoneIcon,
    GlobeIcon,
    MapIcon,
    BuildingIcon,
    HomeIcon,
  } from 'lucide-svelte';

  interface Props {
    data: import('./$types').PageData;
  }

  let { data }: Props = $props();

  let brewery = $derived(data.brewery);
  let pageTitle = $derived(
    `${brewery?.name ?? 'Brewery Not Found'} | Open Brewery DB`
  );
  let pageDescription = $derived(
    `${brewery?.name ?? 'Brewery Not Found'}, ${brewery?.city ?? 'Unknown'}, ${brewery?.state_province ?? 'Unknown'}`
  );
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
</svelte:head>

{#if !brewery}
  <div class="max-w-4xl mx-auto px-4 py-8 text-center">
    <p class="text-xl text-amber-600 my-4">
      Brewery with ID {data.id} does not exist.
    </p>
  </div>
{:else}
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <!-- Header with brewery name and type -->
      <div class="p-6 bg-amber-50 border-b border-amber-100">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900">
              {brewery.name}
            </h1>
            <p class="mt-1 text-lg text-amber-700 capitalize">
              {brewery.brewery_type}
            </p>
          </div>
          <div class="flex items-center gap-3">
            {#if brewery.website_url}
              <a
                href={brewery.website_url}
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center gap-1 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors duration-200"
                aria-label="Visit website"
              >
                <GlobeIcon size={16} />
                <span class="hidden sm:inline">Website</span>
              </a>
            {/if}
            {#if brewery.latitude && brewery.longitude}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${brewery.latitude},${brewery.longitude}`}
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center gap-1 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors duration-200"
                aria-label="View on Google Maps"
              >
                <MapIcon size={16} />
                <span class="hidden sm:inline">Directions</span>
              </a>
            {/if}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <!-- Left column: Brewery details -->
        <div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-3">Location</h2>
            <div class="flex flex-col space-y-2 text-gray-700">
              {#if brewery.address_1}
                <div class="flex items-start gap-2">
                  <HomeIcon
                    size={18}
                    class="text-amber-600 mt-1 flex-shrink-0"
                  />
                  <span>
                    {brewery.address_1}{brewery.address_2
                      ? `, ${brewery.address_2}`
                      : ''}{brewery.address_3 ? `, ${brewery.address_3}` : ''}
                  </span>
                </div>
              {/if}
              <div class="flex items-start gap-2">
                <BuildingIcon
                  size={18}
                  class="text-amber-600 mt-1 flex-shrink-0"
                />
                <div>
                  <a
                    class="text-amber-600 hover:text-amber-900 transition-colors duration-200"
                    href={`/breweries/${brewery.country}/${brewery.state_province}/${brewery.city}`}
                  >
                    {brewery.city}
                  </a>,
                  <a
                    class="text-amber-600 hover:text-amber-900 transition-colors duration-200 ml-1"
                    href={`/breweries/${brewery.country}/${brewery.state_province}`}
                  >
                    {brewery.state_province}
                  </a>
                  {brewery.postal_code ? ` ${brewery.postal_code}` : ''}
                </div>
              </div>
              <div class="flex items-start gap-2">
                <MapPinIcon
                  size={18}
                  class="text-amber-600 mt-1 flex-shrink-0"
                />
                <a
                  class="text-amber-600 hover:text-amber-900 transition-colors duration-200"
                  href={`/breweries/${brewery.country}`}
                >
                  {brewery.country}
                </a>
              </div>
              {#if brewery.phone}
                <div class="flex items-start gap-2">
                  <PhoneIcon
                    size={18}
                    class="text-amber-600 mt-1 flex-shrink-0"
                  />
                  <span>{brewery.phone}</span>
                </div>
              {/if}
            </div>
          </div>
        </div>

        <!-- Right column: Map -->
        <div>
          {#if brewery?.latitude && brewery?.longitude}
            <div
              class="rounded-lg overflow-hidden shadow-md border border-gray-200 bg-white flex flex-col h-full"
            >
              <div class="relative w-full h-0 pb-[75%] sm:pb-[65%]">
                <iframe
                  class="absolute inset-0 w-full h-full border-0"
                  src="https://www.openstreetmap.org/export/embed.html?bbox={brewery.longitude}%2C{brewery.latitude}%2C{brewery.longitude}%2C{brewery.latitude}&layer=mapnik&marker={brewery.latitude}%2C{brewery.longitude}"
                  title="Map showing location of {brewery.name}"
                  loading="lazy"
                  allow="fullscreen"
                ></iframe>
              </div>
              <div
                class="p-3 bg-gray-50 text-sm flex justify-between items-center border-t border-gray-200"
              >
                <a
                  href="https://www.openstreetmap.org/?mlat={brewery.latitude}&mlon={brewery.longitude}#map=18/{brewery.latitude}/{brewery.longitude}"
                  target="_blank"
                  rel="noreferrer"
                  class="text-amber-600 hover:text-amber-900 transition-colors duration-200 flex items-center gap-1"
                >
                  <MapPinIcon size={16} />
                  <span>View Larger Map</span>
                </a>
                <span class="text-xs text-gray-500">
                  © <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noreferrer"
                    class="text-amber-600 hover:text-amber-900">OSM</a
                  >
                </span>
              </div>
            </div>
          {:else}
            <div
              class="rounded-lg overflow-hidden shadow-md border border-gray-200 bg-gray-100 flex items-center justify-center h-full min-h-[200px]"
            >
              <p class="text-gray-500 italic">No location data available</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
