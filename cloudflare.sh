#!/bin/sh

date "+%Y-%m-%d %H:%M:%S"
ip_file="ip.txt"

new_ip=$(curl -s http://ipecho.net/plain)

if [ -f $ip_file ]; then
    ip=$(cat $ip_file)
    if [ "$ip" = "$new_ip" ]; then
		echo "Same ip: $ip"
        exit 0
    fi
fi

ip="$new_ip"
echo "IP: $ip"
zone_id=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$ZONE" -H "X-Auth-Email: $EMAIL" -H "X-Auth-Key: $API" -H "Content-Type: application/json" | grep -Eo '"id":.?"\w*?"' |head -1|grep -o ':.*".*"'|grep -o '\w*')
echo "Zone ID: $zone_id"
record_id=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records?name=$HOST" -H "X-Auth-Email: $EMAIL" -H "X-Auth-Key: $API" -H "Content-Type: application/json" | grep -Eo '"id":.?"\w*?"' |head -1|grep -o ':.*".*"'|grep -o '\w*')
echo "Record ID: $record_id"
update=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records/$record_id" -H "X-Auth-Email: $EMAIL" -H "X-Auth-Key: $API" -H "Content-Type: application/json" --data "{\"id\":\"$zone_id\",\"type\":\"A\",\"name\":\"$HOST\",\"content\":\"$ip\",\"ttl\":$TTL,\"proxied\":$PROXY}")

if echo "$update" | grep -q "\"success\":true"; then
	echo "IP changed to: $ip"	
  echo "$ip" > $ip_file
else
	printf "Update failed:\\n%s" "$update"
	exit 1
fi