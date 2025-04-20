import { sequence } from "@sveltejs/kit/hooks";
import { handleErrorWithSentry, sentryHandle, initCloudflareSentryHandle } from "@sentry/sveltekit";

export const handle = sequence(
  initCloudflareSentryHandle({
      dsn: 'https://a5831fe9174e1bb01a828906b51574ba@o4509011200704512.ingest.us.sentry.io/4509183525322752',
      tracesSampleRate: 1.0,
  }),
  sentryHandle()
);

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
