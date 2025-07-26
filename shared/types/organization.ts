import type { z } from "zod/v4";
import type { organizationSchema } from "../schemas/organization.schema.ts";
import type { EntityContact } from "./contact.js";

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

export type Organization = z.infer<typeof organizationSchema>;

export interface OrganizationDetails
  extends Pick<
    Organization,
    | "id"
    | "name"
    | "about"
    | "slug"
    | "photo"
    | "photoThumbnail"
    | "website"
    | "address"
    | "postalCode"
    | "city"
    | "district"
    | "nipc"
  > {
  contacts: EntityContact[];
}

export interface OrganizationSearchResult {
  id: string;
  name: string;
}
