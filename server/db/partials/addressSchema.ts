import { text } from "drizzle-orm/sqlite-core";

export const addressSchema = {
  address: text("address", { length: 256 }),
  postalCode: text("postal_code", { length: 8 }),
  city: text("city", { length: 256 }),
  district: text("district", { length: 128 }),
};
