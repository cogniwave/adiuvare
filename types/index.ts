// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface GenericObject<T = any> {
  [key: string]: T;
}
