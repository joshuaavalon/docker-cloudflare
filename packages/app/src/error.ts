import type { ApiError } from "@cloudflare-ddns/api";
import type { AxiosError } from "axios";

const isAxiosError = (error: any): error is AxiosError =>
  error.isAxiosError === true;

export class CloudflareError extends Error {}

export class CloudflareApiError extends CloudflareError {
  public errors: ApiError[];
  public constructor(errors: ApiError[]) {
    const messages = errors.map(error => JSON.stringify(error)).join("\n");
    super(`Api Error from Cloudflare. Errors: \n${messages}`);
    this.errors = errors;
  }
}

export const wrapError = (e: Error): Error => {
  if (!isAxiosError(e)) {
    return e;
  }
  const res = e.response;
  if (!res) {
    return e;
  }
  const { success, errors, result } = res.data;
  if (!success || !result) {
    return new CloudflareApiError(errors);
  }
  return e;
};
