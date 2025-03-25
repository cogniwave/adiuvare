import * as Sentry from "@sentry/nuxt";
import { name, version } from "./package.json";

const environment = process.env.NUXT_ENV;

export const baseConfig = {
  dsn: "https://94eb244f0d063f2c1de0420e0855f284@o4508888194416641.ingest.de.sentry.io/4509040764584016",
  environment,
  tracesSampleRate: 0.1,
  releases: `${name}@${version}`,
};

export { Sentry };
