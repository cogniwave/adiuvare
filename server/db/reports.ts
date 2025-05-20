import { useDrizzle } from "../db";
import { reports } from "./schemas/reports.schema";
import type { InsertReport } from "./schemas/reports.schema";
import { formatEntityToDb as toDb } from "./utils";

const formatToDb = toDb(["post"]);

export const createReport = async (payload: InsertReport) => {
  return await useDrizzle()
    .insert(reports)
    .values(formatToDb(payload) as InsertReport);
};
