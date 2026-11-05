import { handleErrorWithSentry, replayIntegration } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';
import { dev } from '$app/env';
import { sentryDataCollection } from '#lib/sentry.js';

Sentry.init({
  dsn: 'https://a5831fe9174e1bb01a828906b51574ba@o4509011200704512.ingest.us.sentry.io/4509183525322752',
  tracesSampleRate: 0.1,
  enabled: !dev,
  dataCollection: sentryDataCollection,

  // Browser profiling requires the Document-Policy: js-profiling response
  // header (set via _headers for static assets and hooks.server for SSR).
  profileSessionSampleRate: 0.1,
  profileLifecycle: 'trace',

  replaysSessionSampleRate: 0.01,

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // If you don't want to use Session Replay, just remove the line below:
  integrations: [
    replayIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
  ],
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
