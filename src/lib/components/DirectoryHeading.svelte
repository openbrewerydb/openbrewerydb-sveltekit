<script lang="ts">
  import { titleCase } from '$lib/utils';

  export let city: string | undefined = undefined;
  export let state: string | undefined = undefined;
  export let country: string;
</script>

<h1 class="text-4xl">
  Breweries in {city ? titleCase(city) + ', ' : ''}{state
    ? titleCase(state) + ', '
    : ''}{titleCase(country) ?? ''}
</h1>
