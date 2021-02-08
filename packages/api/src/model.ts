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
  per_page?: number;
  direction?: "asc" | "desc";
}
