# API Token

Cloudflare supports API token which can limits scope and permission.

## Create Token

First, go to your profile page and access the API Tokens page. Click `Create Token`.

![API Tokens page](./api-token.png)

Then, create a token with `#dns_records:edit` and `#zone:read` (optional).

> `#zone:read` is needed if you want to use zone name instead of zone id. If you copy and paste the zone id to configuration, `#zone:read` is not needed.

> The token can be limited to specific zones in `Zone Resources`.

![Create API token](./create-token.png)

After that, click `Continue to summary` and `Create Token`. Note that the token needed to be copied, it will not be shown again after this. It can be deleted and create a new one anytime needed.
