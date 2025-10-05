export const FEED_PAGE_SIZE = 30;

type Types = number | boolean | string | object | Array<Types> | null | undefined;

export const sanitizeArray = (arr: Types[]): Types[] => {
  return arr.map<Types>((val) => {
    if (typeof val === "number" || typeof val === "boolean" || val === null || val === undefined) {
      return val;
    }

    // array
    if (Array.isArray(val)) {
      return sanitizeArray(val);
    }

    // obj
    if (typeof val === "object") {
      return sanitizeObj(val);
    }

    return sanitizeInput<string>(val);
  });
};

export const sanitizeObj = (value: Types) => {
  if (typeof value === "number" || typeof value === "boolean" || value === null || value === undefined) {
    return value;
  }

  if (typeof value !== "object") {
    return sanitizeInput<string>(value);
  }

  return Object.entries(value).reduce<Record<string, Types>>((result, [prop, val]) => {
    // array
    if (Array.isArray(val)) {
      result[prop] = sanitizeArray(val);
    }
    // obj
    else if (typeof val === "object") {
      result[prop] = sanitizeObj(val);
    }
    // str
    else if (typeof val === "string") {
      result[prop] = sanitizeInput<string>(val);
    }
    // anything else
    else {
      result[prop] = sanitizeInput<string>(val);
    }

    return result;
  }, {});
};
