<script>
	import { fade } from 'svelte/transition';
	import '../app.css';
	import logo from '../../static/obdb-logo.png';

	let showMenu = false;

	function toggleMenu() {
		showMenu = !showMenu;
	}
</script>

<div class="flex flex-col">
	<div class="relative overflow-hidden p-3">
		<div class="relative pt-6 pb-16 sm:pb-24">
			<div>
				<div class="max-w-7xl mx-auto px-4 sm:px-6">
					<nav
						class="relative flex items-center justify-between sm:h-10 md:justify-center"
						aria-label="Global"
					>
						<div class="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
							<div class="flex items-center justify-between w-full md:w-auto">
								<a href="/">
									<span class="sr-only">Open Brewery DB</span>
									<img class="h-12 w-auto sm:h-16" src={logo} alt="Open Brewery DB Logo" />
								</a>
								<div class="-mr-2 flex items-center md:hidden">
									<button
										on:click={toggleMenu}
										type="button"
										class="bg-gray-50 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
										aria-expanded="false"
									>
										<span class="sr-only">Open main menu</span>
										<!-- Heroicon name: outline/menu -->
										<svg
											class="h-6 w-6"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 6h16M4 12h16M4 18h16"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>
						<div class="hidden md:flex md:space-x-10">
							<a href="/start" class="font-medium text-gray-500 hover:text-gray-900"
								>Getting Started</a
							>
							<a href="/documentation" class="font-medium text-gray-500 hover:text-gray-900">Docs</a
							>
							<a href="/contribute" class="font-medium text-gray-500 hover:text-gray-900"
								>Contribute</a
							>
							<a href="/about" class="font-medium text-gray-500 hover:text-gray-900">About</a>
						</div>
						<div
							class="hidden md:absolute md:flex md:items-center md:justify-end md:inset-y-0 md:right-0"
						>
							<span class="inline-flex rounded-md shadow">
								<a
									href="/login"
									class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-yellow-600 bg-white hover:bg-gray-50"
								>
									Log in
								</a>
							</span>
						</div>
					</nav>
				</div>

				{#if showMenu}
					<div
						transition:fade
						class="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
					>
						<div
							class="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden"
						>
							<div class="px-5 pt-4 flex items-center justify-between">
								<div class="-mr-2">
									<button
										on:click={toggleMenu}
										type="button"
										class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
									>
										<span class="sr-only">Close menu</span>
										<!-- Heroicon name: outline/x -->
										<svg
											class="h-6 w-6"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>
							</div>
							<div class="px-2 pt-2 pb-3">
								<a
									href="/start"
									class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
									>Getting Started</a
								>
								<a
									href="/documentation"
									class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
									>Docs</a
								>
								<a
									href="/contribute"
									class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
									>Contribute</a
								>
								<a
									href="/about"
									class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
									>About</a
								>
							</div>
							<a
								href="/login"
								class="block w-full px-5 py-3 text-center font-medium text-yellow-600 bg-gray-50 hover:bg-gray-100"
							>
								Log in
							</a>
						</div>
					</div>
				{/if}
			</div>
			<main class="mt-12 mx-auto max-w-7xl px-4">
				<slot />
			</main>
		</div>
	</div>
</div>
