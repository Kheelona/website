/**
 * Optional Sentry setup for error tracking and performance monitoring
 *
 * To enable:
 * 1. npm install @sentry/nextjs
 * 2. Set SENTRY_AUTH_TOKEN in environment
 * 3. Run: npx sentry-cli releases files upload-sourcemaps ./out
 */

// Uncomment below to initialize Sentry for error tracking:
/*
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "production",
  tracesSampleRate: 1.0,
  debug: false,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
*/

export {};
