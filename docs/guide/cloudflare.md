# Cloudflare

In this part, it goes through on how to gather necessary information from Cloudflare.

## Authentication

At August 30, 2019,[Cloudflare announces the general availability of API tokens][api-token-blog]. API tokens limit the privileges each token has. The reason behind is [principle of least privilege][least-privilege]. Thus, API tokens are the recommended way to handle authentication.

### API Token

First, go to your profile page and access the API Tokens page. Click `Create Token`.

![API Tokens page](./api-token.png)

Then, create a token with `#dns_records:edit` and k (optional).

::: tip
`#zone:read` is needed if you want to use zone name instead of zone id. If you copy and paste the zone id to configuration, `#zone:read` is not needed.
:::

::: tip
The token can be limited to specific zones in `Zone Resources`.
:::

![Create API token](./create-token.png)

After that, click `Continue to summary` and `Create Token`. Note that the token needed to be copied, it will not be shown again after this. It can be deleted and create a new one anytime needed.

### Global API Key

::: warning
Global API key is deprecated. Although it is still supported with Cloudflare API, this Docker image will deprecate it in favor of API token. The support for global API key will be removed in future release.
:::

Go to your profile page and access the API Tokens page. Click `View` on Global API Key.

![API Tokens page](./api-token.png)

## Zone ID

Go to you domain overview page and scroll to the bottom. Copy the `Zone ID` in the API section.

![Zone ID](./zone-id.png)

[api-token-blog]: https://blog.cloudflare.com/api-tokens-general-availability/
[least-privilege]: https://en.wikipedia.org/wiki/Principle_of_least_privilege
