import { db } from ".";
import { reports } from "./schemas/reports.schema";

import type { InsertReport } from "./schemas/reports.schema";

export const createReport = async (payload: InsertReport) => {
  return await db.insert(reports).values(payload);
};
