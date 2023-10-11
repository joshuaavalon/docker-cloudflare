import type { Message } from "./cloudflare/index.js";

export class CloudflareApiError extends Error {
  public errors: Message[];
  public constructor(errors: Message[]) {
    const messages = errors.map(error => JSON.stringify(error)).join("\n");
    super(`Api Error from Cloudflare. Errors: \n${messages}`);
    this.errors = errors;
  }
}
