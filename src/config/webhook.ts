export type Webhook = {
  run?: string;
  success?: string;
  failure?: string;
};

export const getRunWebhook = (webhook: Webhook): string | undefined =>
  webhook.run;
export const getSuccessWebhook = (webhook: Webhook): string | undefined =>
  webhook.success;
export const getFailureWebhook = (webhook: Webhook): string | undefined =>
  webhook.failure;
