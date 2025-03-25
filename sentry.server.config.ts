import { Sentry, baseConfig } from "./sentry.base.config";

Sentry.init({
  ...baseConfig,
  integrations: [Sentry.anrIntegration({ captureStackTrace: true }), Sentry.extraErrorDataIntegration()],
});
