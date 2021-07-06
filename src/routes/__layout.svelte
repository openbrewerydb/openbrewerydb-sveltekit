<script>
	import Nav from '$lib/components/Nav.svelte';
</script>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>

<div class="flex flex-col">
	<Nav />
	<div>
		<slot></slot>
	</div>
</div>

