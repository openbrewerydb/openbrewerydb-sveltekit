<script lang="ts">
  import { linkify } from '$lib/utils';

  const { text, truncated = false } = $props<{
    text?: string;
    truncated?: boolean;
  }>();
</script>

{#if text}
  <p class="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-800">
    {#each linkify(text) as part}
      {#if part.type === 'link'}
        <a
          class="text-amber-800 underline decoration-amber-300 underline-offset-4 hover:decoration-amber-500"
          href={part.href}
          target="_blank"
          rel="noopener noreferrer">{part.value}</a
        >
      {:else}
        {part.value}
      {/if}
    {/each}
    {truncated ? '…' : ''}
  </p>
{/if}
