export const organizationCategories = [
  "unknown",
  "ipss",
  "ongd",
  "onga",
  "onga_equiparada",
  "ongm",
  "assoc_def_direitos_humanos",
  "assoc_def_animais",
  "cooperativa",
  "fundacoes",
  "other",
] as const;

export type OrganizationCategory = (typeof organizationCategories)[number];
