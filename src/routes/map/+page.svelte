<script lang="ts">
  import {
    MapLibre,
    GeoJSON,
    CircleLayer,
    Popup,
    SymbolLayer,
  } from 'svelte-maplibre';
  import breweryGeoJson from '$site/breweries.geojson?url';
  import { API_URL } from '$lib/utils';
  import type { Brewery } from '$lib/types';

  let clickedFeature;
  let clickedBrewery: Brewery;

  async function getBrewery() {
    const breweryResults = await fetch(
      `${API_URL}/breweries/${clickedFeature.id}`
    );
    const brewery: Brewery = await breweryResults.json();
    clickedBrewery = brewery;
  }
</script>

<svelte:head>
  <title>Map - Open Brewery DB</title>
  <meta property="og:title" content="Map - Open Brewery DB" />
  <meta
    property="og:description"
    content="Map of breweries in Open Brewery DB"
  />
  <meta name="twitter:title" content="Map - Open Brewery DB" />
  <meta
    name="twitter:description"
    content="Map of breweries in Open Brewery DB"
  />
</svelte:head>

<h1>Brewery Map</h1>

<MapLibre
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  standardControls
  class="relative w-full aspect-[9/16] max-h-[70vh] sm:max-h-full sm:aspect-video"
  center={[-40.755638, 37.525571]}
  zoom={2}
>
  <GeoJSON
    id="breweries"
    data={breweryGeoJson}
    cluster={{
      radius: 500,
      maxZoom: 10,
    }}
  >
    <CircleLayer
      id="cluster_circles"
      applyToClusters
      hoverCursor="pointer"
      paint={{
        'circle-color': '#f1f075',
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
        'circle-stroke-width': 1,
      }}
      manageHoverState
    />

    <SymbolLayer
      id="cluster_labels"
      interactive={false}
      applyToClusters
      layout={{
        'text-field': [
          'format',
          ['get', 'point_count_abbreviated'],
          { 'font-scale': 0.8 },
        ],
        'text-size': 12,
        'text-offset': [0, -0.1],
      }}
    />

    <CircleLayer
      id="brewery_circle"
      applyToClusters={false}
      hoverCursor="pointer"
      paint={{
        'circle-color': '#f1f075',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#000',
      }}
      on:click={async (e) => {
        clickedFeature = e.detail.features?.[0]?.properties;
        await getBrewery();
      }}
    >
      <Popup
        openOn="click"
        closeOnClickInside
        on:close={() => (clickedBrewery = null)}
        let:features
      >
        {@const props = features?.[0]?.properties}
        <ul>
          {#if clickedBrewery}
            <li>
              <strong>Brewery:</strong>
              {clickedBrewery.name} ({clickedBrewery.brewery_type})
            </li>
            <li><strong>Street:</strong> {clickedBrewery.address_1}</li>
            <li>
              <strong>Location:</strong>
              {clickedBrewery.city}, {clickedBrewery.state_province}
            </li>
            <li><strong>Country:</strong>: {clickedBrewery.country}</li>
          {:else}
            ...
          {/if}
        </ul>
      </Popup>
    </CircleLayer>
  </GeoJSON>
</MapLibre>
