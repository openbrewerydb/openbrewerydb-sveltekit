<script lang="ts">
  import { MapPinIcon, ExternalLinkIcon } from 'lucide-svelte';

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
  <p class="text-xl text-amber-600 my-4">
    Brewery with ID {data.id} does not exist.
  </p>
{:else}
  <div class="flex items-center gap-x-3">
    <h1 class="text-4xl">{brewery.name}</h1>
    <div>
      {#if brewery.latitude && brewery.longitude}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${brewery.latitude},${brewery.longitude}`}
          target="_blank"
          rel="noreferrer"
          class="text-amber-600 hover:text-amber-900"
          ><MapPinIcon size={20} /></a
        >
      {/if}
      {#if brewery.website_url}
        <a
          href={brewery.website_url}
          target="_blank"
          rel="noreferrer"
          class="text-amber-600 hover:text-amber-900"
          ><ExternalLinkIcon size={20} /></a
        >
      {/if}
    </div>
  </div>

  <dl class="grid grid-cols-2 max-w-sm my-3">
    <dt class="font-semibold">Type:</dt>
    <dd>{brewery.brewery_type}</dd>
    <dt class="font-semibold">Address:</dt>
    <dd>
      {brewery.address_1}{brewery.address_2
        ? `, ${brewery.address_2}`
        : ''}{brewery.address_3 ? `, ${brewery.address_3}` : ''}
    </dd>
    <dt class="font-semibold">City:</dt>
    <dd>
      <a
        class="text-amber-600 hover:text-amber-900"
        href={`/breweries/${brewery.country}/${brewery.state_province}/${brewery.city}`}
        >{brewery.city}</a
      >
    </dd>
    <dt class="font-semibold">State:</dt>
    <dd>
      <a
        class="text-amber-600 hover:text-amber-900"
        href={`/breweries/${brewery.country}/${brewery.state_province}`}
        >{brewery.state_province}</a
      >
    </dd>
    <dt class="font-semibold">Postal Code:</dt>
    <dd>{brewery.postal_code || ''}</dd>
    <dt class="font-semibold">Country:</dt>
    <dd>
      <a
        class="text-amber-600 hover:text-amber-900"
        href={`/breweries/${brewery.country}`}>{brewery.country}</a
      >
    </dd>
    <dt class="font-semibold">Phone:</dt>
    <dd>{brewery.phone || ''}</dd>
  </dl>
{/if}
