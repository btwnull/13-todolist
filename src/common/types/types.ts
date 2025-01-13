export type Response<T = {}> = {
  data: T;
  resultCode: number;
  fieldsErrors: FieldError[];
  messages: string[];
};

export type FieldError = {
  error: string;
  field: string;
};
