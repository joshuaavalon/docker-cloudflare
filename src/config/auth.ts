import { has } from "ramda";

export type GlobalAuth = {
  /**
   * Cloudflare account email
   */
  email: string;
  /**
   * Cloudflare API Key
   */
  globalToken: string;
};

export type ScopedAuth = {
  /**
   * Cloudflare API token
   */
  scopedToken: string;
};

export type Auth = ScopedAuth | GlobalAuth;

export const isGlobalAuth = (auth: Auth): auth is GlobalAuth =>
  has("email", auth);
