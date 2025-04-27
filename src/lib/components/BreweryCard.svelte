<script lang="ts">
  import { ExternalLinkIcon, MapPinIcon } from 'lucide-svelte';

  let { brewery } = $props();
</script>

<div
  class="bg-white shadow rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
>
  <div class="p-4">
    <div class="flex justify-between items-start">
      <h3 class="text-lg font-medium text-gray-900 truncate">
        <a
          class="text-amber-600 hover:text-amber-900 transition-colors duration-200"
          href="/b/{brewery.id}"
        >
          {brewery.name}
        </a>
      </h3>
      <div class="flex space-x-2">
        {#if brewery.latitude && brewery.longitude}
          <a
            href="https://www.google.com/maps/search/?api=1&query={brewery.latitude},{brewery.longitude}"
            target="_blank"
            rel="noreferrer"
            class="text-amber-600 hover:text-amber-900 transition-colors duration-200"
            aria-label="View on map"
          >
            <MapPinIcon size={20} />
          </a>
        {/if}
        {#if brewery.website_url}
          <a
            href={brewery.website_url}
            target="_blank"
            rel="noreferrer"
            class="text-amber-600 hover:text-amber-900 transition-colors duration-200"
            aria-label="Visit website"
          >
            <ExternalLinkIcon size={20} />
          </a>
        {/if}
      </div>
    </div>

    <div class="mt-2 text-sm text-gray-600">
      <p class="truncate">{brewery.address_1 ?? ''}</p>
      <div class="flex flex-wrap gap-x-1">
        <a
          class="text-amber-600 hover:text-amber-900 transition-colors duration-200"
          href="/breweries/{brewery.country}/{brewery.state_province}/{brewery.city}"
        >
          {brewery.city}
        </a>
        <span>,</span>
        <a
          class="text-amber-600 hover:text-amber-900 transition-colors duration-200"
          href="/breweries/{brewery.country}/{brewery.state_province}"
        >
          {brewery.state_province}
        </a>
        <span>{brewery.postal_code}</span>
      </div>
      <div class="mt-1 flex justify-between">
        <a
          class="text-amber-600 hover:text-amber-900 transition-colors duration-200"
          href="/breweries/{brewery.country}"
        >
          {brewery.country}
        </a>
        <a
          href={`/breweries/${brewery.country}?by_type=${brewery.brewery_type}`}
          class="text-amber-600 hover:text-amber-900 transition-colors duration-200 capitalize"
          data-testid="brewery-type-link"
        >
          {brewery.brewery_type}
        </a>
      </div>
    </div>
  </div>
</div>
