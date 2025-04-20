<script lang="ts">
  import { titleCase } from '$lib/utils';

  interface Props {
    city?: string | undefined;
    state?: string | undefined;
    country: string;
  }

  let { city = undefined, state = undefined, country }: Props = $props();
</script>

<h1 class="text-4xl">
  Breweries in {city ? titleCase(city) + ', ' : ''}{state
    ? titleCase(state) + ', '
    : ''}{titleCase(country) ?? ''}
</h1>
