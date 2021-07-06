<script>
	let menuIsOpen = false
</script>

<header class="relative">
	<div class="bg-yellow-400 py-6">
		<nav class="relative max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6" aria-label="Global">
			<div class="flex items-center flex-1">
				<div class="flex items-center justify-between w-full md:w-auto">
					<a href="/">
						<span class="text-2xl text-yellow-900 text-nowrap">Open Brewery DB</span>
					</a>
					<div class="-mr-2 flex items-center md:hidden">
						<button type="button" class="bg-yellow-900 rounded-md p-2 inline-flex items-center justify-center text-yellow-400 hover:bg-yellow-800 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white" aria-expanded="false" on:click={() => menuIsOpen = true}>
							<span class="sr-only">Open main menu</span>
							<!-- Heroicon name: outline/menu -->
							<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>
				</div>
				<div class="hidden space-x-8 md:flex md:ml-10">
					<a href="/product" class="text-base font-medium text-yellow-50 hover:text-yellow-600 text-shadow">Product</a>
					<a href="/features" class="text-base font-medium text-yellow-50 hover:text-yellow-600">Features</a>
					<a href="/marketplace" class="text-base font-medium text-yellow-50 hover:text-yellow-600">Marketplace</a>
					<a href="/company" class="text-base font-medium text-yellow-50 hover:text-yellow-600">Company</a>
				</div>
			</div>
			<div class="hidden md:flex md:items-center md:space-x-6">
				<a href="/login" class="text-base font-medium text-yellow-50 hover:text-yellow-600">
					Log in
				</a>
				<a href="/get-started" class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700">
					Start free trial
				</a>
			</div>
		</nav>
	</div>

	{#if menuIsOpen}
	<div class="absolute top-0 inset-x-0 p-2 transition transform origin-top md:hidden">
		<div class="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
			<div class="px-5 pt-4 flex items-center justify-between">
				<div>
					<span class="text-2xl text-yellow-900">Open Brewery DB</span>
				</div>
				<div class="-mr-2">
					<button type="button" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-yellow-400 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-600" on:click={() => menuIsOpen = false}>
						<span class="sr-only">Close menu</span>
						<!-- Heroicon name: outline/x -->
						<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>
			<div class="pt-5 pb-6">
				<div class="flex flex-col px-2 space-y-1">
					<a href="/product" class="block px-3 py-2 rounded-md text-base font-medium text-yellow-900 hover:bg-yellow-50">Product</a>
					<a href="/feature" class="block px-3 py-2 rounded-md text-base font-medium text-yellow-900 hover:bg-yellow-50">Features</a>
					<a href="/marketplace" class="block px-3 py-2 rounded-md text-base font-medium text-yellow-900 hover:bg-yellow-50">Marketplace</a>
					<a href="/company" class="block px-3 py-2 rounded-md text-base font-medium text-yellow-900 hover:bg-yellow-50">Company</a>
				</div>
				<div class="mt-6 px-5">
					<a href="/signup" class="block text-center w-full py-3 px-4 rounded-md shadow bg-gradient-to-r from-yellow-500 to-red-600 text-white font-medium hover:from-yellow-600 hover:to-red-700">Start free trial</a>
				</div>
				<div class="mt-6 px-5">
					<p class="text-center text-base font-medium text-yellow-500">Existing customer? <a href="/login" class="text-yellow-900 hover:underline">Login</a></p>
				</div>
			</div>
		</div>
	</div>
	{/if}
</header>

