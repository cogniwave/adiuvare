import type { z } from "zod/v4";

import type { reportSchema } from "shared/schemas/report.schema";

export type Report = z.infer<typeof reportSchema>;
