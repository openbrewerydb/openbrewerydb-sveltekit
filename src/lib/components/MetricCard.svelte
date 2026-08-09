<script lang="ts">
  import type { LucideIcon } from '@lucide/svelte';
  import { formatCompactNumber, formatNumber } from '$lib/utils/metrics';

  interface Props {
    icon: LucideIcon;
    value: number;
    label: string;
    subtitle?: string;
    breakdown?: Array<{ label: string; value: number }>;
    format?: (n: number) => string;
  }

  let { icon: Icon, value, label, subtitle, breakdown, format = formatCompactNumber }: Props = $props();
</script>

<div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
  <div class="flex items-center justify-between mb-3">
    <Icon class="w-8 h-8 text-amber-600" />
  </div>
  <div class="text-3xl font-bold text-gray-900 mb-1">
    {format(value)}
  </div>
  <div class="text-sm font-medium text-gray-700 mb-2">
    {label}
  </div>
  {#if subtitle}
    <div class="text-xs text-gray-600">{subtitle}</div>
  {/if}
  {#if breakdown && breakdown.length > 0}
    <div class="text-xs text-gray-600 space-y-1">
      {#each breakdown as item (item.label)}
        <div>
          {item.label}: {formatNumber(item.value)}
        </div>
      {/each}
    </div>
  {/if}
</div>
