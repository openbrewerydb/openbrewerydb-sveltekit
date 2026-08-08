import { dev } from '$app/environment';
import {
  handleErrorWithSentry,
  initCloudflareSentryHandle,
} from '@sentry/sveltekit';

// Cloudflare Sentry needs the workerd Sentry binding, which only exists in
// deployed Workers. Initializing it in dev crashes workerd's SQLite.
if (!dev) {
  initCloudflareSentryHandle({
    dsn: 'https://a5831fe9174e1bb01a828906b51574ba@o4509011200704512.ingest.us.sentry.io/4509183525322752',
    tracesSampleRate: 1.0,
  });
}

export function handle({ event, resolve }) {
  if (
    dev &&
    event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json'
  ) {
    return new Response(undefined, { status: 404 });
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-type';
    },
  });
}

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
