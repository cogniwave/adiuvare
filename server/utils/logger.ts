export const log = (title: string, error?: string) => {
  // check possible pino integrations
  console.log(title, error);
  // add sentry support
};
