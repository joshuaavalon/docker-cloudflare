import { prop } from "ramda";

export type Webhook = {
  run?: string;
  success?: string;
  failure?: string;
};

export const getRunWebhook = prop<Webhook, "run">("run");
export const getSuccessWebhook = prop<Webhook, "success">("success");
export const getFailureWebhook = prop<Webhook, "failure">("failure");
