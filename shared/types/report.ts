import type { z } from "zod/v4";

import type { reportSchema } from "shared/schemas/report";

export type Report = z.infer<typeof reportSchema>;
