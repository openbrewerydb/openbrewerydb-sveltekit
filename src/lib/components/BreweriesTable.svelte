<script lang="ts">
  import { ExternalLinkIcon, MapPinIcon } from 'lucide-svelte';

  let {
    breweries = [],
    context = 'country',
    country: _country = '',
    state: _state = '',
    city: _city = '',
  } = $props();
</script>

<table class="min-w-full divide-y divide-gray-300" data-testid="brewery-table">
  <thead class="bg-gray-100">
    <tr>
      <th
        scope="col"
        class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
        >Name</th
      >
      <th
        scope="col"
        class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell"
        >Street</th
      >
      <th
        scope="col"
        class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
        >City</th
      >
      <th
        scope="col"
        class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
        >State / Province</th
      >
      <th
        scope="col"
        class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell"
        >Postal Code</th
      >
      <th
        scope="col"
        class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 hidden md:table-cell"
        >Country</th
      >
      <th
        scope="col"
        class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 hidden md:table-cell"
        >Type</th
      >
      <th
        scope="col"
        class="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6"
      >
        <span class="sr-only">Actions</span>
      </th>
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-200 bg-white">
    {#each breweries as brewery (brewery.id)}
      <tr>
        <td
          class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 max-w-xs truncate"
          ><a
            class="text-amber-600 hover:text-amber-900 transition-colors duration-200"
            href="/b/{brewery.id}">{brewery.name}</a
          ></td
        >
        <td
          class="whitespace-nowrap px-2 py-2 text-sm text-gray-500 hidden lg:table-cell"
          >{brewery.address_1 ?? ''}</td
        >
        <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
          ><a
            class="text-amber-600 hover:text-amber-900 transition-colors duration-200"
            href="/breweries/{brewery.country}/{brewery.state_province}/{brewery.city}"
            >{brewery.city}</a
          ></td
        >
        <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
          ><a
            class="text-amber-600 hover:text-amber-900 transition-colors duration-200"
            href="/breweries/{brewery.country}/{brewery.state_province}"
            >{brewery.state_province}</a
          ></td
        >
        <td
          class="whitespace-nowrap px-2 py-2 text-sm text-gray-500 hidden lg:table-cell"
          >{brewery.postal_code}</td
        >
        <td
          class="whitespace-nowrap px-2 py-2 text-sm text-gray-500 hidden md:table-cell"
          ><a
            class="text-amber-600 hover:text-amber-900 transition-colors duration-200"
            href="/breweries/{brewery.country}">{brewery.country}</a
          ></td
        >
        <td class="whitespace-nowrap px-2 py-2 text-sm hidden md:table-cell"
          ><a
            href={(() => {
              // Determine the correct URL based on context
              switch (context) {
                case 'city':
                  return `/breweries/${brewery.country}/${brewery.state_province}/${brewery.city}?by_type=${brewery.brewery_type}`;
                case 'state':
                  return `/breweries/${brewery.country}/${brewery.state_province}?by_type=${brewery.brewery_type}`;
                case 'country':
                default:
                  return `/breweries/${brewery.country}?by_type=${brewery.brewery_type}`;
              }
            })()}
            class="text-amber-600 hover:text-amber-900 transition-colors duration-200 capitalize"
          >
            {brewery.brewery_type}
          </a></td
        >
        <td
          class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
        >
          {#if brewery.latitude && brewery.longitude}
            <a
              href="https://www.google.com/maps/search/?api=1&query={brewery.latitude},{brewery.longitude}"
              target="_blank"
              rel="noreferrer"
              class="text-amber-600 hover:text-amber-900 transition-colors duration-200"
              ><MapPinIcon size={20} /></a
            >
          {/if}
          {#if brewery.website_url}
            <a
              href={brewery.website_url}
              target="_blank"
              rel="noreferrer"
              class="text-amber-600 hover:text-amber-900 transition-colors duration-200"
              ><ExternalLinkIcon size={20} /></a
            >
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
