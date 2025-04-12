<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
  /**
   * A component that provides TailwindCSS styling for markdown content.
   * Styling is applied via the #markdown-content ID in tailwind.css.
   */
</script>

<div id="markdown-content" class="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6">
  {@render children?.()}
</div>
