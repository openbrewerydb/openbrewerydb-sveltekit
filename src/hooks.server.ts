import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';
import {
  handleErrorWithSentry,
  sentryHandle,
  initCloudflareSentryHandle,
} from '@sentry/sveltekit';

export function handle({ event, resolve }) {
  sequence(
    initCloudflareSentryHandle({
      dsn: 'https://a5831fe9174e1bb01a828906b51574ba@o4509011200704512.ingest.us.sentry.io/4509183525322752',
      tracesSampleRate: 1.0,
    }),
    sentryHandle()
  );

  if (
    dev &&
    event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json'
  ) {
    return new Response(undefined, { status: 404 });
  }

  return resolve(event);
}

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
