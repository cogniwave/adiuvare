import { sql } from "drizzle-orm";
import { contacts } from "./dbSchemas/contacts.db.schema";

// sqlite doesn't support json format, anything that's json is actually stored as string
// for some reason drizzle doesn't really convert it properly to and from json, so we
// need to manually do it
export const formatToDb =
  (fieldsToSerialize?: string[]) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T = any>(payload: T): T => {
    if (!fieldsToSerialize?.length) {
      return payload;
    }

    return {
      ...payload,
      ...fieldsToSerialize.reduce<Record<string, string>>((result, field) => {
        // @ts-expect-error ts complains because T is defined as any
        if (payload[field]) {
          // @ts-expect-error ts complains because T is defined as any
          result[field] = JSON.stringify(payload[field]);
        }

        return result;
      }, {}),
    };
  };

export const formatFromDb =
  (fieldsToDeserialize?: string[]) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T = any>(payload: any): T => {
    if (!fieldsToDeserialize?.length) {
      return payload;
    }

    return {
      ...payload,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...fieldsToDeserialize.reduce<Record<string, any>>((result, field) => {
        if (payload[field]) {
          result[field] = JSON.parse(payload[field]);
        }

        return result;
      }, {}),
    };
  };

export const contactsGrouping = () => {
  return sql`'[' || GROUP_CONCAT('{"contact":' || ${contacts.contact} || ',"type":"' || ${contacts.type} || '"}', ',') || ']'`;
};
