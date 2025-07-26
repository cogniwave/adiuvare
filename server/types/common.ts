export const sortOrder = ["asc", "desc"] as const;

export type SortOrder = (typeof sortOrder)[number];
