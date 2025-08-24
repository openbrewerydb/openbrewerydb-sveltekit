<script lang="ts">
  // Props (Svelte 5 runes)
  const { text, truncated = false } = $props<{
    text?: string;
    truncated?: boolean;
  }>();

  // Convert plain text with URLs into parts to render safe clickable links
  function linkify(input?: string) {
    const value = input ?? '';
    const urlRe = /(https?:\/\/[^\s)]+)(?![^<]*>)/gi;
    const parts: Array<{ type: 'text' | 'link'; value: string; href?: string }> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = urlRe.exec(value)) !== null) {
      const start = match.index;
      const url = match[0];
      if (start > lastIndex) {
        parts.push({ type: 'text', value: value.slice(lastIndex, start) });
      }
      parts.push({ type: 'link', value: url, href: url });
      lastIndex = start + url.length;
    }
    if (lastIndex < value.length) {
      parts.push({ type: 'text', value: value.slice(lastIndex) });
    }
    return parts;
  }
</script>

{#if text}
  <p class="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-800">
    {#each linkify(text) as part}
      {#if part.type === 'link'}
        <a
          class="text-amber-800 underline decoration-amber-300 underline-offset-4 hover:decoration-amber-500"
          href={part.href}
          target="_blank"
          rel="noopener noreferrer"
          >{part.value}</a
        >
      {:else}
        {part.value}
      {/if}
    {/each}
    {truncated ? '…' : ''}
  </p>
{/if}
