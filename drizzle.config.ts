import * as dotenv from "dotenv";

import { defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({
  schema: "./server/database/dbSchemas/*.ts",
  out: "./server/database/migrations",
  dialect: "sqlite",
});
