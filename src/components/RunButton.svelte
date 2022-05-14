<script>
  import Prism from 'prismjs';

  export let endpoint;
  let html = null;

  $: comment = '// GET ' + endpoint + '\n';

  async function handleClick() {
    const response = await fetch(endpoint, { cache: 'reload' });
    if (response.ok) {
      const result = await response.json();
      const string = comment + JSON.stringify(result, null, 4);
      html = Prism.highlight(string, Prism.languages.javascript, 'javascript');
    } else {
      console.error(response);
    }
  }
</script>

<button
  class="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 my-4 mb-4 md:text-lg md:px-10"
  on:click={handleClick}>Run <span class="ml-2 text-xl">▶</span></button
>

{#if html}
  <!-- No extra whitespace with <pre> -->
  <!-- prettier-ignore -->
  <div><pre class="language-javascript"><code class="language-javascript">{@html html}</code></pre></div>
{/if}
