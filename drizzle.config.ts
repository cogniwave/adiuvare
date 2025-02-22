import * as dotenv from "dotenv";

import { defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({
  schema: "./server/db/schemas/*.ts",
  out: "./server/db/migrations",
  dialect: "sqlite",
});
