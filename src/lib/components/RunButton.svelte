<script lang="ts">
  import Prism from 'prismjs';
  import { Loader2, Play } from 'lucide-svelte';



  interface Props {
    /**
   * Component that displays a button to run an API request and show the result
   */
    endpoint: string;
  }

  let { endpoint }: Props = $props();
  let html: string | null = $state(null);
  let isLoading: boolean = $state(false);
  let hasError: boolean = $state(false);
  let errorMessage: string = $state('');

  let comment = $derived('// GET ' + endpoint + '\n');

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
  type="button"
  class="inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 my-4 md:text-lg md:px-10 transition-colors transition-shadow duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
  onclick={handleClick}
  disabled={isLoading}
  aria-busy={isLoading}
  aria-live="polite"
>
  {#if isLoading}
    <Loader2 class="h-5 w-5 animate-spin" aria-hidden="true" />
    <span>Running...</span>
  {:else}
    <Play class="h-5 w-5" aria-hidden="true" />
    <span>Run request</span>
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
