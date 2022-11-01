<script lang="ts">
  import { snakeCase } from 'snake-case';
  import type { Brewery } from '$lib/types';

  export let breweries: Brewery[];
</script>

<table class="min-w-full divide-y divide-gray-300">
  <thead class="bg-gray-50">
    <tr>
      <th
        scope="col"
        class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
        >Name</th
      >
      <th
        scope="col"
        class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
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
        class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
        >Postal Code</th
      >
      <th
        scope="col"
        class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
        >Country</th
      >
      <th
        scope="col"
        class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
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
    {#each breweries as brewery}
      {@const breweryState = brewery.county_province
        ? brewery.county_province
        : brewery.state}
      <tr>
        <td
          class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-900 sm:pl-6"
          ><a href="/breweries/{snakeCase(brewery.id)}" class="underline"
            >{brewery.name}</a
          ></td
        >
        <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
          >{brewery.street}</td
        >
        <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
          ><a
            href="/breweries/{snakeCase(brewery.country)}/{snakeCase(
              breweryState
            )}/{snakeCase(brewery.city)}"
            class="underline">{brewery.city}</a
          ></td
        >
        <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
          ><a
            href="/breweries/{snakeCase(brewery.country)}/{snakeCase(
              breweryState
            )}"
            class="underline">{breweryState}</a
          ></td
        >
        <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
          >{brewery.postal_code}</td
        >
        <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
          ><a href="/breweries/{snakeCase(brewery.country)}" class="underline"
            >{brewery.country}</a
          ></td
        >
        <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
          >{brewery.brewery_type}</td
        >
        <td
          class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
        >
          {#if brewery.latitude && brewery.longitude}
            <a href="#" class="text-amber-600 hover:text-amber-900">Map</a>
          {/if}
          {#if brewery.website_url}
            <a
              href={brewery.website_url}
              class="text-amber-600 hover:text-amber-900">Website</a
            >
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
