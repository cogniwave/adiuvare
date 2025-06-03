import * as dotenv from "dotenv";

import { defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({
  schema: "./server/database/schemas/*.ts",
  out: "./server/database/migrations",
  dialect: "sqlite",
});
