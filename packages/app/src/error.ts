import type { ApiError } from "@cloudflare-ddns/api";

export class CloudflareError extends Error {}

export class CloudflareApiError extends CloudflareError {
  public errors: ApiError[];
  public constructor(errors: ApiError[]) {
    const messages = errors.map(error => JSON.stringify(error)).join("\n");
    super(`Api Error from Cloudflare. Errors: \n${messages}`);
    this.errors = errors;
  }
}
