export type ResultError = {
  code: number;
  message: string;
};

export type ApiResponse<T> = {
  success: boolean;
  errors: ResultError[];
  result: T;
};

export type Api<T extends any[], U> = (...args: T) => Promise<ApiResponse<U>>;

export class ApiError extends Error {
  errors: ResultError[];

  public constructor(errors: ResultError[]) {
    const json = JSON.stringify({ errors }, undefined, 2);
    super(`Failed API request:\n${json}`);
    this.errors = errors;
  }
}

export const getApiResult = <T>(value: ApiResponse<T>): T => value.result;

export const throwFailure = (json: ApiResponse<any>): ApiResponse<any> => {
  const { success, errors } = json;
  if (!success) {
    throw new ApiError(errors);
  }
  return json;
};
