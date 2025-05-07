import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { and, eq } from "drizzle-orm";
import { useDrizzle } from "server/db";
import { contacts } from "server/db/schemas/contacts.schema";

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(), // displayName normalizado
  displayName: text("display_name").notNull(),
  ownerId: text("owner_id").notNull(), // user.id
  category: text("category").notNull().default("unknown"), // validar com Joi depois
  slug: text("slug").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  verified: integer("verified", { mode: "boolean" }).notNull(),

  // Campos opcionais
  nipc: text("nipc"),
  acceptSameDomainUsers: integer("accept_same_domain_users").default(1), //true
  token: text("token"),
  about: text("about"),
  website: text("website"),
  address: text("address"),
  postalCode: text("postal_code"),
  city: text("city"),
  district: text("district"),
  photo: text("photo"),
  photoThumbnail: text("photo_thumbnail"),
});

// **********
export const getOrgsById = async () => {
  const result = await useDrizzle()
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: users.slug,
      email: users.email,
      bio: users.bio,
      photo: users.photo,
      photoThumbnail: users.photoThumbnail,
      contacts: users.contacts,
      website: users.website,
      address: users.address,
      postalCode: users.postalCode,
      city: users.city,
      district: users.district,
    })
    .from(users)
    .where(and(eq(users.type, "org"), eq(users.verified, true)))
    .orderBy(asc(users.name))
    .limit(50);

  return result || [];
};

export const getTotalOrgs = async () => {
  const result = await useDrizzle().select({ total: count() }).from(users).where(eq(users.type, "org"));

  try {
    return result[0]!.total ?? 0;
  } catch (_) {
    return 0;
  }
};

export const getOrgBySlug = async (slug: string) => {
  const result = await useDrizzle()
    .select({
      id: users.id,
      name: users.name,
      bio: users.bio,
      slug: users.slug,
      photo: users.photo,
      photoThumbnail: users.photoThumbnail,
      contacts: users.contacts,
      website: users.website,
      address: users.address,
      postalCode: users.postalCode,
      city: users.city,
      district: users.district,
    })
    .from(users)
    .where(and(eq(users.slug, slug), eq(users.verified, true)))
    .limit(1);

  return result.length === 1 ? result[0] : null;
};
