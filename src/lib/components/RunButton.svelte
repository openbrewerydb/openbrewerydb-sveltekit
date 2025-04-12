<script lang="ts">
  import Prism from 'prismjs';

  /**
   * Component that displays a button to run an API request and show the result
   */

  export let endpoint: string;
  let html: string | null = null;
  let isLoading: boolean = false;
  let hasError: boolean = false;
  let errorMessage: string = '';

  $: comment = '// GET ' + endpoint + '\n';

  /**
   * Handles the click event to fetch data from the endpoint
   */
  const handleClick = async (): Promise<void> => {
    isLoading = true;
    hasError = false;
    errorMessage = '';
    
    try {
      const response = await fetch(endpoint, { cache: 'reload' });
      if (response.ok) {
        const result = await response.json();
        const string = comment + JSON.stringify(result, null, 4);
        html = Prism.highlight(string, Prism.languages.javascript, 'javascript');
      } else {
        hasError = true;
        errorMessage = `Error: ${response.status} ${response.statusText}`;
        console.error(response);
      }
    } catch (error) {
      hasError = true;
      errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(error);
    } finally {
      isLoading = false;
    }
  };
</script>

<button
  class="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 my-4 mb-4 md:text-lg md:px-10 transition-colors duration-200"
  on:click={handleClick}
  disabled={isLoading}
>
  {#if isLoading}
    <span class="mr-2">Loading...</span>
    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  {:else}
    <span>Run</span> <span class="ml-2 text-xl">▶</span>
  {/if}
</button>

{#if hasError}
  <div class="bg-red-50 border-l-4 border-red-400 p-4 my-4 rounded">
    <div class="flex">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3">
        <p class="text-sm text-red-700">{errorMessage}</p>
      </div>
    </div>
  </div>
{/if}

{#if html}
  <div class="rounded-md overflow-hidden shadow-md my-4">
    <pre class="language-javascript m-0"><code class="language-javascript">{@html html}</code></pre>
  </div>
{/if}
