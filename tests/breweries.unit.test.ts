import { describe, it, expect, vi } from 'vitest';
import { load } from '../src/routes/breweries/+page';

type LoadEvent = Parameters<typeof load>[0];

// The Sentry Vite plugin wraps load functions and reads event.url/route.
function createEvent(search: string, fetchImpl: typeof fetch) {
  return {
    url: new URL(`https://www.openbrewerydb.org/breweries${search}`),
    fetch: fetchImpl,
    setHeaders: vi.fn(),
    route: { id: '/breweries' },
  } as unknown as LoadEvent & { setHeaders: ReturnType<typeof vi.fn> };
}

const ok = (body: unknown) => new Response(JSON.stringify(body));

describe('breweries load', () => {
  it.each([
    ['search fails', '?query=dogfish', [new Response(null, { status: 500 })]],
    [
      'list fails',
      '?by_state=ohio',
      [new Response(null, { status: 429 }), ok({ total: '1' })],
    ],
    [
      'meta fails',
      '?by_state=ohio',
      [ok([]), new Response(null, { status: 500 })],
    ],
  ])('throws an uncacheable 503 when %s', async (_label, search, responses) => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetch = vi.fn();
    for (const r of responses) fetch.mockResolvedValueOnce(r);
    const event = createEvent(search, fetch);
    await expect(load(event)).rejects.toMatchObject({ status: 503 });
    expect(event.setHeaders).toHaveBeenCalledWith({
      'cache-control': 'no-store',
    });
  });

  it('throws an uncacheable 503 on network failure', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetch = vi.fn().mockRejectedValue(new TypeError('fetch failed'));
    const event = createEvent('?query=dogfish', fetch);
    await expect(load(event)).rejects.toMatchObject({ status: 503 });
    expect(event.setHeaders).toHaveBeenCalledWith({
      'cache-control': 'no-store',
    });
  });

  it('returns results without touching cache headers on success', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(ok([{ id: 'a' }]))
      .mockResolvedValueOnce(ok({ total: '1' }));
    const event = createEvent('?by_state=ohio', fetch);
    const result = await load(event);
    expect(result.breweries).toEqual([{ id: 'a' }]);
    expect(result.meta.total).toBe('1');
    expect(event.setHeaders).not.toHaveBeenCalled();
  });
});
