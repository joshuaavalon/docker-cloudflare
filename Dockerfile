FROM python:3.6.2-alpine3.6

ADD cloudflare.py /app
ADD requirements.txt /app

WORKDIR "/app"

CMD [ "pip", "install", "requirements.txt" ]

CMD [ "python", "cloudflare.py" ]