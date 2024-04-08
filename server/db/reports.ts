import { db } from ".";
import { reports } from "./schemas/reports";

import type { InsertReport } from "./schemas/reports";

export const createReport = async (payload: InsertReport) => {
  return await db.insert(reports).values(payload);
};
