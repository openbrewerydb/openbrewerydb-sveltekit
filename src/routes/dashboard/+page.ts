import { API_URL } from '$lib/utils';
import { mapSubdivisionToCountryId, countryIdToLabel } from '$lib/data/subdivisions-to-country';

interface BreweryMetaResponse {
  total: string | number;
  by_state: Record<string, number>;
  by_type: Record<string, number>;
}

export async function load() {
  try {
    const res = await fetch(`${API_URL}/breweries/meta`);
    if (!res.ok) {
      return { total: 0, byType: [], byCountry: [], error: `Failed to fetch metadata (${res.status})` };
    }
    const data: BreweryMetaResponse = await res.json();

    const total = typeof data.total === 'string' ? parseInt(data.total) || 0 : data.total ?? 0;

    const byType = Object.entries(data.by_type)
      .map(([name, count]) => ({
        name,
        count,
        pct: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const countryCounts = new Map<string, number>();
    const unknownSubs: Array<{ name: string; count: number }> = [];
    for (const [subdivision, count] of Object.entries(data.by_state)) {
      const cid = mapSubdivisionToCountryId(subdivision);
      const key = cid === 'unknown' ? 'unknown' : cid;
      if (key === 'unknown') unknownSubs.push({ name: subdivision, count });
      countryCounts.set(key, (countryCounts.get(key) ?? 0) + count);
    }

    const byCountry = Array.from(countryCounts.entries())
      .map(([countryId, count]) => ({
        countryId,
        label: countryId === 'unknown' ? 'Unknown' : countryIdToLabel(countryId),
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const unknownTotal = unknownSubs.reduce((s, x) => s + x.count, 0);
    if (unknownSubs.length > 0) {
      const sample = unknownSubs
        .sort((a, b) => b.count - a.count)
        .slice(0, 12)
        .map((x) => `${x.name} (${x.count})`);
      console.warn('[dashboard/+page] unknown subdivision mappings:', {
        unknownCount: unknownSubs.length,
        unknownTotal,
        sample,
      });
    }

    return { total, byType, byCountry, unknownSubs, unknownTotal };
  } catch (err) {
    console.error('❌ dashboard load error', err);
    return { total: 0, byType: [], byCountry: [], error: 'Failed to fetch brewery metadata' };
  }
}
