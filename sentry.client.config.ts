import { Sentry, baseConfig } from "./sentry.base.config";

Sentry.init({
  ...baseConfig,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.vueIntegration({
      attachProps: true,
      tracingOptions: {
        trackComponents: true,
        hooks: ["activate", "create", "destroy", "mount", "update", "unmount"],
      },
    }),
  ],
});
