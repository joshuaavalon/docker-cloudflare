#!/usr/bin/env bash

if [ "$CF_DNS__LOG_TYPE" == "json" ]; then
  msg='{"level":30,"time":';
  msg+=$(date +%s%3N)
  msg+=',"pid":';
  msg+="$$";
  msg+=',"hostname":"';
  msg+=$(hostname);
  msg+='","msg":"Initializing container"}'
  echo "$msg";
else
  echo "
  Initializing container

  User uid: $(id -u node)
  User gid: $(id -g node)
";
fi

chown node:node /app;

if [ "$CF_DNS__LOG_TYPE" == "json" ]; then
  msg='{"level":30,"time":';
  msg+=$(date +%s%3N)
  msg+=',"pid":';
  msg+="$$";
  msg+=',"hostname":"';
  msg+=$(hostname);
  msg+='","msg":"';
  msg+="Setting crontab to ${CF_DNS__CRON}";
  msg+='"}';
  echo "$msg";
else
  echo "Setting crontab to ${CF_DNS__CRON}";
fi


if [ -f /etc/debian_version ]; then
  echo -e "${CF_DNS__CRON} root /app/cloudflare.sh" >> /etc/cron.d/cloudflare-ddns;
  chmod 600 /etc/cron.d/cloudflare-ddns;
  cron -f;
else
  # Delete last line
  sed -i '$ d' /etc/crontabs/root;
  echo -e "${CF_DNS__CRON} /app/cloudflare.sh" >> /etc/crontabs/root;
  chmod 600 /etc/crontabs/root;
  crond -f;
fi
