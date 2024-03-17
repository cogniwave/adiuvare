import * as dotenv from "dotenv";

dotenv.config();

import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";

(async function () {
  try {
    const db = drizzle(sql);

    await migrate(db, { migrationsFolder: "server/db/migrations" });

    console.log("Migration successful");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
