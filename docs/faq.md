# Frequently Asked Questions

**Q. Why do you move your image from joshuaavalon/docker-cloudflare to joshava/cloudflare-ddns?**

A. There are several reasons for me to make this decision.

First, DockerHub automatic build service is bad. Not only it is slow, it does not support multiple build well.
The rebuild on upstream image updated does not even work. so I have to move to a CI service.

However, DockerHub does not support access token (seriously?) which means you have to put your DockerHub password on the CI service. I do not want to risk leaking my account password so I create a bot account for CI usage.

Furthermore, DockerHub personal account does not support collaborators. so, I have to create a organize account or convert my account to organize. Because I want to keep my current account, so I create `joshava` (because I am poor at naming things 🤷‍♂️).

**Q. How do I run this on Raspberry Pi?**

A. Use image with `arm32v6` tags.

**Q. Why do you stop using bash script?**

A. It will be too complex to implement all the new features in bash script.

**Q. Why do you use \<other language\>?**

A. Other scripting language I know is TypeScript and Python. While Python is a good choice, I like static typings for type hint in IDE. Typing in Python is very incomplete and many libraries does not support it. On the other hand, there are much more JavaScript libraries that have TypeScript definitions.

**Q. Why do you support \<other format\> for configuration file?**

A. You can open a feature request. If many people votes for it, I may consider it.
