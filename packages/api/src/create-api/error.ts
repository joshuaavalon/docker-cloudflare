import type { ApiError } from "./type.js";

export class CloudflareApiError extends Error {
  public errors: ApiError[];
  public constructor(errors: ApiError[]) {
    const messages = errors.map(error => JSON.stringify(error)).join("\n");
    super(`Api Error from Cloudflare. Errors: \n${messages}`);
    this.errors = errors;
  }
}
