export type ContactType = "email" | "phone" | "fax" | "other";
export type ContactEntityType = "organization" | "user";

export interface Contact {
  entityId: string;
  entityType: ContactEntityType;
  contact: string;
  type: ContactType;
}
