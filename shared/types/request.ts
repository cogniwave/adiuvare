export interface ValidationErrorPayload {
  field: string;
  reason: string;
}

export interface GetListResult<T> {
  data: T[];
  total: number;
}
