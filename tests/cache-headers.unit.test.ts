import { describe, it, expect } from 'vitest';
import { edgeCacheTtl } from '$lib/server/cache';

describe('edgeCacheTtl', () => {
  it('caches metrics-backed pages for 1 hour', () => {
    expect(edgeCacheTtl('/')).toBe(3600);
    expect(edgeCacheTtl('/stats')).toBe(3600);
    expect(edgeCacheTtl('/stats/__data.json')).toBe(3600);
  });

  it('caches brewery detail pages for 1 hour', () => {
    expect(edgeCacheTtl('/b/123')).toBe(3600);
    expect(edgeCacheTtl('/b/123/__data.json')).toBe(3600);
  });

  it('caches other pages for 24 hours', () => {
    expect(edgeCacheTtl('/breweries')).toBe(86400);
    expect(edgeCacheTtl('/breweries/united_states/ohio')).toBe(86400);
    expect(edgeCacheTtl('/about')).toBe(86400);
  });
});
