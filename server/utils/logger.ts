import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "warn",
  ...(process.env.NUXT_ENV === "development" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  }),
});

// export const updateContext = (newContext: string) => (context = newContext);

export default logger;
