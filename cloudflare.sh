#!/bin/sh

echo "Current time: $(date "+%Y-%m-%d %H:%M:%S")"
ip_file="ip"

new_ip=$(curl -s http://ipecho.net/plain)

# Fallbacks
if [ -z "$new_ip" ]; then
    new_ip=$(curl -s http://whatismyip.akamai.com)
fi
if [ -z "$new_ip" ]; then
    new_ip=$(curl -s http://icanhazip.com/)
fi
if [ -z "$new_ip" ]; then
    new_ip=$(curl -s https://tnx.nl/ip)
fi

if [ -z "$new_ip" ]; then
    echo "Empty IP !"
    exit 0
fi

if [ -f $ip_file ]; then
  ip=$(cat $ip_file)
  if [ "$ip" = "$new_ip" ]; then
    echo "Same ip: $ip"
    exit 0
  fi
fi

ip="$new_ip"
echo "IP: $ip"

# Fetches zone id for the account
zone_id=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$ZONE" -H "X-Auth-Email: $EMAIL" -H "X-Auth-Key: $API" -H "Content-Type: application/json" | jq -r '.result[0].id')
echo "Zone ID: $zone_id"

# Tries to fetch the record id of the host
record_id=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records?name=$HOST" -H "X-Auth-Email: $EMAIL" -H "X-Auth-Key: $API" -H "Content-Type: application/json" | jq -r '.result[0].id')

# Adds or updates the record
if [ $record_id = "null" ]; then
  # If no record id found, then adds a new record
  success=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records" -H "X-Auth-Email: $EMAIL" -H "X-Auth-Key: $API" -H "Content-Type: application/json" --data "{\"type\":\"A\",\"name\":\"$HOST\",\"content\":\"$ip\",\"ttl\":$TTL,\"priority\":10,\"proxied\": $PROXY}" | jq -r ".success")

  if $DEBUG; then
    echo POST "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records" -H "X-Auth-Email: $EMAIL" -H "X-Auth-Key: $API" -H "Content-Type: application/json" --data "{\"type\":\"A\",\"name\":\"$HOST\",\"content\":\"$ip\",\"ttl\":$TTL,\"priority\":10,\"proxied\": $PROXY}"
  fi
else
  # If a record id is found, updates the existing record
  echo "Record ID: $record_id"
  success=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records/$record_id" -H "X-Auth-Email: $EMAIL" -H "X-Auth-Key: $API" -H "Content-Type: application/json" --data "{\"id\":\"$zone_id\",\"type\":\"A\",\"name\":\"$HOST\",\"content\":\"$ip\",\"ttl\":$TTL,\"proxied\":$PROXY}" | jq -r ".success")

  if $DEBUG; then
    echo PUT "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records/$record_id" -H "X-Auth-Email: $EMAIL" -H "X-Auth-Key: $API" -H "Content-Type: application/json" --data "{\"id\":\"$zone_id\",\"type\":\"A\",\"name\":\"$HOST\",\"content\":\"$ip\",\"ttl\":$TTL,\"proxied\":$PROXY}"
  fi
fi

if [ $success = "true" ]; then
  echo "IP changed to: $ip"	
  echo "$ip" > $ip_file
else
  printf "Update failed:\\n%s" "$update"
  exit 1
fi
