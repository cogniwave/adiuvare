// sqlite doesn't support json format, anything that's json is actually stored as string
// for some reason drizzle doesn't really convert it properly to and from json, so we
// need to manually do it
/* export const formatToDb =
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
  }; */

export const formatEntityOfDb = <T>(fields: string[] = []) => {
  return (payload: unknown): T => {
    if (!fields.length) return payload as T;

    return {
      ...(payload as Record<string, unknown>),
      ...fields.reduce<Record<string, unknown>>((result, field) => {
        const value = (payload as Record<string, unknown>)[field];
        if (typeof value === "string") {
          try {
            result[field] = JSON.parse(value);
          } catch {
            result[field] = value;
          }
        }
        return result;
      }, {}),
    } as T;
  };
};
