<script lang="ts">
  export let city: string | undefined = undefined;
  export let state: string | undefined = undefined;
  export let country: string;
</script>

<h1 class="text-4xl my-4">
  Breweries in {city ? city + ', ' : ''}{state ? state + ', ' : ''}{country ??
    ''}
</h1>
