import { describe, it, expect, vi } from 'vitest';
import { load } from '../src/routes/b/[id]/+page';

const UUID = 'b54b16e1-ac3b-4bff-a11f-f7ae9ddc27e0';
const API_PREFIX = 'https://api.openbrewerydb.org/v1/breweries/';

type LoadEvent = Parameters<typeof load>[0];

// The Sentry Vite plugin wraps load functions and reads event.url/route,
// so the mock event needs them even though the loader itself doesn't.
function createEvent(id: string, fetchImpl: typeof fetch) {
  return {
    params: { id },
    fetch: fetchImpl,
    setHeaders: vi.fn(),
    url: new URL(`https://www.openbrewerydb.org/b/${encodeURIComponent(id)}`),
    route: { id: '/b/[id]' },
  } as unknown as LoadEvent & { setHeaders: ReturnType<typeof vi.fn> };
}

describe('brewery detail load', () => {
  it.each([
    'invalid-id',
    'b54b16e1 ac3b-4bff-a11f-f7ae9ddc27e0',
    'b54b16e1%2Dac3b-4bff-a11f-f7ae9ddc27e0',
    '..%2F..%2Fetc',
    `${UUID}x`,
    'a'.repeat(100),
  ])('rejects malformed id %p without calling the API', async (id) => {
    const fetch = vi.fn();
    await expect(load(createEvent(id, fetch))).rejects.toMatchObject({
      status: 404,
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('lowercases valid ids before calling the API', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ id: UUID }), { status: 200 })
      );
    await load(createEvent(UUID.toUpperCase(), fetch));
    expect(fetch).toHaveBeenCalledWith(`${API_PREFIX}${UUID}`);
  });

  it('returns the brewery on success', async () => {
    const brewery = { id: UUID, name: 'Tree House Brewing' };
    const fetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(brewery)));
    const result = await load(createEvent(UUID, fetch));
    expect(result.brewery).toEqual(brewery);
  });

  it('turns an API 404 into a page 404', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 404 }));
    await expect(load(createEvent(UUID, fetch))).rejects.toMatchObject({
      status: 404,
    });
  });

  it.each([429, 500, 503])(
    'reports API status %i as unavailable and prevents caching',
    async (status) => {
      const fetch = vi.fn().mockResolvedValue(new Response(null, { status }));
      const event = createEvent(UUID, fetch);
      await expect(load(event)).rejects.toMatchObject({ status: 503 });
      expect(event.setHeaders).toHaveBeenCalledWith({
        'cache-control': 'no-store',
      });
    }
  );

  it('reports a network failure as unavailable', async () => {
    const fetch = vi.fn().mockRejectedValue(new TypeError('fetch failed'));
    const event = createEvent(UUID, fetch);
    await expect(load(event)).rejects.toMatchObject({ status: 503 });
    expect(event.setHeaders).toHaveBeenCalledWith({
      'cache-control': 'no-store',
    });
  });

  it('reports invalid JSON as a bad gateway', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(new Response('<html>oops</html>', { status: 200 }));
    const event = createEvent(UUID, fetch);
    await expect(load(event)).rejects.toMatchObject({ status: 502 });
    expect(event.setHeaders).toHaveBeenCalledWith({
      'cache-control': 'no-store',
    });
  });
});
