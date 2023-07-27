export interface ApiResponse<T> {
  success: boolean;
  errors: ApiError[];
  messages: unknown[];
  result: T | null;
}

export interface ApiError {
  code: number;
  message: string;
}

export interface ListParameter {
  match?: string;
  name?: string;
  order?: string;
  page?: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  per_page?: number;
  direction?: "asc" | "desc";
}

export type ApiRequest<TParam, TData> = {
  baseUrl?: string;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  data?: Record<string, unknown>;
  auth?: Auth;
  timeout: number;
} & (TParam extends undefined
  ? { params?: ListParameter & TParam }
  : { params: ListParameter & TParam }) &
  (TData extends undefined ? { data?: TData } : { data: TData });

export interface Auth {
  /**
   * Cloudflare API token
   */
  scopedToken: string;
}
