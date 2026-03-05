<script lang="ts">
  import type { ComponentType } from 'svelte';
  import { formatCompactNumber, formatNumber } from '$lib/utils/metrics';

  interface Props {
    icon: ComponentType;
    value: number;
    label: string;
    subtitle?: string;
    breakdown?: Array<{ label: string; value: number }>;
  }

  let { icon: Icon, value, label, subtitle, breakdown }: Props = $props();
</script>

<div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
  <div class="flex items-center justify-between mb-3">
    <Icon class="w-8 h-8 text-amber-600" />
  </div>
  <div class="text-3xl font-bold text-gray-900 mb-1">
    {formatCompactNumber(value)}
  </div>
  <div class="text-sm font-medium text-gray-700 mb-2">
    {label}
  </div>
  {#if subtitle}
    <div class="text-xs text-gray-500">{subtitle}</div>
  {/if}
  {#if breakdown && breakdown.length > 0}
    <div class="text-xs text-gray-500 space-y-1">
      {#each breakdown as item}
        <div>
          {item.label}: {formatNumber(item.value)}
        </div>
      {/each}
    </div>
  {/if}
</div>
