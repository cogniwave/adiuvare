// import pino from "pino";

// const logger = pino({
//   level: import.meta.env.LOG_LEVEL || "warn",
//   ...(import.meta.env.NODE_ENV === "development" && {
//     transport: {
//       target: "pino-pretty",
//       options: {
//         colorize: true,
//       },
//     },
//   }),
// });

// // export const updateContext = (newContext: string) => (context = newContext);

// export default logger;

export default {
  error: console.error,
  debug: console.debug,
};
