# Frequently Asked Questions

**Q. Why should I use this over [nouchka/cloudflare-dyndns][nouchka]?**

A. Compare to [nouchka/cloudflare-dyndns][nouchka] (4.0):
 * Smaller size: 4MB vs 54MB
 * Able to update subdomain
 * Update when IP is changed

 [nouchka]: https://hub.docker.com/r/nouchka/cloudflare-dyndns/

 **Q. Why do you move your image from joshuaavalon/docker-cloudflare to joshava/cloudflare-ddns?**
 
 A. There are several reasons for me to make this decision.

 First, DockerHub automatic build service is bad. Not only it is slow, it does not support multiple build well.
 The rebuild on upstream image updated does not even work. so I have to move to a CI service.

 However, DockerHub does not support access token (seriously?) which means you have to put your DockerHub password on the CI service. I do not want to risk leaking my account password so I create a bot account for CI usage.

 Furthermore, DockerHub personal account does not support collaborators. so, I have to create a organize account or convert my account to organize. Because I want to keep my current account, so I create `joshava` (because I am poor at naming things 🤷‍♂️).

 **Q. How do I run this on Raspberry Pi?**

 A. Use image with `arm32v6` tags.
