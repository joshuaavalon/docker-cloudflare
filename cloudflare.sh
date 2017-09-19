#!/bin/bash

update_cloudflare() {
    zone_id=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$ZONE" -H "X-Auth-Email: $EMAIL" -H "X-Auth-Key: $API" -H "Content-Type: application/json" | perl -nle'print $& if m{(?<="id":")[^"]*}' | head -1 )
    record_id=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records?name=$ZONE" -H "X-Auth-Email: $EMAIL" -H "X-Auth-Key: $API" -H "Content-Type: application/json"  | perl -nle'print $& if m{(?<="id":")[^"]*}')
    update=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records/$record_id" -H "X-Auth-Email: $EMAIL" -H "X-Auth-Key: $API" -H "Content-Type: application/json" --data "{\"id\":\"$zone_id\",\"type\":\"A\",\"name\":\"$ZONE\",\"content\":\"$ip\",\"ttl\":$TTL,\"proxied\":$PROXY}")

    if [[ ${update} == *"\"success\":false"* ]]; then
        echo "API UPDATE FAILED. DUMPING RESULTS:\n$update"
        exit 1
    else
        echo "IP changed to: $ip"
    fi
}

# http://icanhazip.com Also works
ip=$(curl -s http://ipecho.net/plain)
update_cloudflare


while sleep $WAIT; do
    new_ip=$(curl -s http://ipecho.net/plain)
    if [[ "${ip}" == "$new_ip" ]]; then
        echo "Same ip: $ip"
    else
        ip="$new_ip"
        update_cloudflare
    fi
done
