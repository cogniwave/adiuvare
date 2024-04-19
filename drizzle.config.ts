import * as dotenv from "dotenv";

import type { Config } from "drizzle-kit";

dotenv.config();

export default {
  schema: "./server/db/schemas/*.ts",
  out: "./server/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URI as string,
  },
} satisfies Config;
