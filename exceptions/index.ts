export interface Errors {
  [key: string]: string;
}

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

export class AxiosError extends Error {
  data: {
    reason: string;
    errors: Errors;
  };
  status: number;

  constructor(reason: string, status: number, errors: Errors = {}) {
    super(reason);

    this.data = { reason, errors };
    this.status = status;
  }
}

export class InvalidToken extends Error {}
