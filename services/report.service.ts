import type { Report } from "@/types/report";

export const submitReport = (report: Report) => {
  return $fetch("/api/v1/reports", { method: "post", body: report });
};
