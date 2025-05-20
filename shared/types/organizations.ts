export interface BaseOrganization {
  id: string;
  // email: string;
  //  password: string;
  displayName: string;
  verified: boolean;
  category:
    | "unknown"
    | "ipss"
    | "ongd"
    | "onga"
    | "onga_equiparada"
    | "ongm"
    | "assoc_def_direitos_humanos"
    | "assoc_def_animais"
    | "cooperativa"
    | "fundacoes"
    | "other";
  ownerId: string;
  acceptSameDomainUsers?: boolean;
}

export interface Organization extends BaseOrganization {
  slug: string;
  nipc?: string;
  token?: string;
  about?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  district?: string;
  photo?: string;
  photoThumbnail?: string;
}

/* export interface OrganizationUser {
  userId: string;
  organizationId: string;
  approved: boolean;
  createdAt: Date;
} */

export type UpdateOrganizationPayload = Partial<Omit<Organization, "id" | "createdAt" | "updatedAt">>;

export interface OrganizationAssociation {
  organizationName?: string | null;
}

export interface RegisterPayload extends BaseOrganization, OrganizationAssociation {
  newsletter?: boolean;
}

export interface GetOrganizationsResult {
  organizations: Organization[];
  total: number;
}

export type OrganizationContacts = Organization & { contacts: Contact[] };
