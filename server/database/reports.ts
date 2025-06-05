import { useDrizzle } from "../database";
import { reports } from "./dbSchemas/reports.db.schema";
import type { InsertReport } from "./dbSchemas/reports.db.schema";
import { formatFromDb as fromDb, formatToDb as toDb } from "./utils";

const _formatFromDb = fromDb(["post"]);
const formatToDb = toDb(["post"]);

export const createReport = async (payload: InsertReport) => {
  return await useDrizzle().insert(reports).values(formatToDb(payload));
};
