import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import {
  handleErrorWithSentry,
  initCloudflareSentryHandle,
  sentryHandle,
} from '@sentry/sveltekit';
import { edgeCacheTtl } from '$lib/server/cache';

// Cloudflare Sentry needs the workerd Sentry binding, which only exists in
// deployed Workers. Initializing it in dev crashes workerd's SQLite.
const cloudflareSentryHandle: Handle = dev
  ? ({ event, resolve }) => resolve(event)
  : initCloudflareSentryHandle({
      dsn: 'https://a5831fe9174e1bb01a828906b51574ba@o4509011200704512.ingest.us.sentry.io/4509183525322752',
      tracesSampleRate: 0.1,
    });

const customHandle: Handle = async ({ event, resolve }) => {
  if (
    dev &&
    event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json'
  ) {
    return new Response(undefined, { status: 404 });
  }

  const response = await resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-type';
    },
  });

  // Let the edge cache repeat hits (bots included) so the Worker doesn't run
  // per request. Requires the zone Cache Rule to honor origin headers.
  if (
    event.request.method === 'GET' &&
    response.ok &&
    !response.headers.has('cache-control')
  ) {
    const headers = new Headers(response.headers);
    headers.set(
      'cache-control',
      `max-age=0, s-maxage=${edgeCacheTtl(event.url.pathname)}`
    );
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
};

const sentryRequestHandle: Handle = dev
  ? ({ event, resolve }) => resolve(event)
  : sentryHandle();

export const handle = sequence(
  cloudflareSentryHandle,
  sentryRequestHandle,
  customHandle
);

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
