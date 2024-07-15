export interface SelectOption {
  title: string;
  value: string;
}

export type HumanDay =
  | "Segunda-feira"
  | "Terça-feira"
  | "Quarta-feira"
  | "Quinta-feira"
  | "Sexta-feira"
  | "Sábado"
  | "Domingo";

export type ValidationResult = string | boolean;

export type ValidationRule =
  | ValidationResult
  | PromiseLike<ValidationResult>
  | ((value: any) => ValidationResult)
  | ((value: any) => PromiseLike<ValidationResult>);

// custom autocompelte filter typing
// https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/composables/filter.ts#L19-L19
export type FilterMatch = boolean | number | [number, number] | [number, number][];

export interface InternalItem<T = any> {
  value: any;
  raw: T;
}

export type FilterFunction<T = any> = (
  value: string,
  query: string,
  item?: InternalItem<T>,
) => FilterMatch;
