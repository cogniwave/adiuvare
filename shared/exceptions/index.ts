import type { ValidationErrorPayload } from "../types/request";

export type Errors = Record<string, string>;

export class ValidationError extends Error {
  errors: Array<{ field: string; error: string }>;

  constructor(errors: Errors = {}) {
    super("Validation error");

    this.errors = Object.entries(errors).map(([field, error]) => ({
      field,
      error,
    }));
  }

  toError() {
    return this.errors.reduce<Errors>((result, { field, error }) => {
      result[field] = error;

      return result;
    }, {});
  }
}

export interface RequestError {
  message: string;
  statusCode: number;
  url: string;
  statusMessage?: string;
  // only exists in dev
  stack?: string;
  data?: ValidationErrorPayload;
}
