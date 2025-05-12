export interface BaseOrganization {
  id: string;
  email: string;
  displayName: string;
  verified: boolean;
  password: string;
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
  acceptSameDomainUsers?: boolean; // default to true
}

export interface Organization extends BaseOrganization {
  slug: string;
  nipc?: string;
  token?: string;
  about?: string;
  website?: string;
  address?: string; // rua
  postalCode?: string;
  city?: string;
  district?: string;
  photo?: string;
  photoThumbnail?: string;
}

export interface OrganizationUser {
  userId: string;
  organizationId: string;
  approved: boolean;
  createdAt: Date;
}

export type UpdateOrganizationPayload = Partial<Omit<Organization, "id" | "createdAt" | "updatedAt">>;

export interface OrganizationAssociation {
  organizationName?: string | null;
}

export interface RegisterPayload extends BaseUser, OrganizationAssociation {
  newsletter?: boolean;  
}

/* export interface GetOrganizationsResult {
  organizations: User[];
  total: number;
} */
