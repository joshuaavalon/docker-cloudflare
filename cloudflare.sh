#!/bin/bash

# Enforces required env variables
required_vars=(ZONE HOST EMAIL API)
for required_var in "${required_vars[@]}"; do
    if [[ -z ${!required_var} ]]; then
        error=1
        echo >&2 "Error: $required_var env variable not set."
    fi
done

if [[ -n $error ]]; then
    exit 1
fi

# PROXY defaults to true
PROXY=${PROXY:-true}

# TTL defaults to 1 (automatic), and is validated
TTL=${TTL:-1}
if [[ $TTL != 1 ]] && [[ $TTL -lt 120 || $TTL -gt 2147483647 ]]; then
    echo >&2 "Error: Invalid TTL value $TTL; must be either 1 (automatic) or between 120 and 2147483647 inclusive."
    exit 1
fi

echo "Current time: $(date "+%Y-%m-%d %H:%M:%S")"
if [[ -z $IPV6 ]]; then
    ip_curl="curl -4s"
    record_type="A"
else
    ip_curl="curl -6s"
    record_type="AAAA"
fi

# Determines the current IP address
new_ip=$($ip_curl http://ipecho.net/plain)

# IP address service fallbacks
if [[ -z $new_ip ]]; then
    new_ip=$($ip_curl http://whatismyip.akamai.com)
fi
if [[ -z $new_ip ]]; then
    new_ip=$($ip_curl http://icanhazip.com/)
fi
if [[ -z $new_ip ]]; then
    new_ip=$($ip_curl https://tnx.nl/ip)
fi

if [[ -z $new_ip ]]; then
    echo >&2 "Error: Unable to reach any service to determine the IP address."
    exit 1
fi

# Compares with last IP address set, if any
ip_file="ip.dat"
if [[ -f $ip_file ]]; then
    ip=$(<$ip_file)
    if [[ $ip = "$new_ip" ]]; then
        echo "IP is unchanged : $ip. Exiting."
        exit 0
    fi
fi

ip="$new_ip"
echo "IP: $ip"

# Fetches the zone information for the account
zone_response=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$ZONE" \
        -H "X-Auth-Email: $EMAIL" \
        -H "X-Auth-Key: $API" \
        -H "Content-Type: application/json")


# If not successful, errors out
if [[ $(jq <<<"$zone_response" -r '.success') != "true" ]]; then
    messages=$(jq <<<"$zone_response" -r '[.errors[] | .message] |join(" - ")')
    echo >&2 "Error: $messages"
    exit 1
fi

# Selects the zone id
zone_id=$(jq <<<"$zone_response" -r ".result[0].id")


# If no zone id was found for the account, errors out.
if [[ -z $zone_id ]]; then
    echo >&2 "Error: Could not determine Zone ID for $ZONE"
    exit 1
fi

echo "Zone $ZONE id : $zone_id"


# Tries to fetch the record of the host
dns_record_response=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records?name=$HOST" \
        -H "X-Auth-Email: $EMAIL" \
        -H "X-Auth-Key: $API" \
        -H "Content-Type: application/json")

if [[ $(jq <<<"$dns_record_response" -r '.success') != "true" ]]; then
    messages=$(jq <<<"$dns_record_response" -r '[.errors[] | .message] |join(" - ")')
    echo >&2 "Error: $messages"
    exit 1
fi

# DNS record to add or update
read -r -d '' new_dns_record <<EOF
{
    "type": "$record_type",
    "name": "$HOST",
    "content": "$ip",
    "ttl": $TTL,
    "priority": 10,
    "proxied": $PROXY
}
EOF

# Adds or updates the record
dns_record_id=$(jq <<<"$dns_record_response" -r ".result[] | select(.type ==\"$record_type\") |.id")
if [[ -z $dns_record_id ]]; then

    # Makes sure we don't have a CNAME by the same name first
    cname_dns_record=$(jq <<<"$dns_record_response" -r '.result[] | select(.type =="CNAME")')
    if [[ -n $(jq <<<"$cname_dns_record" -r '.id') ]]; then
        dns_record_content=$(jq <<<"$cname_dns_record" -r '.content')
        echo >&2 "Error: CNAME entry found for $HOST. Remove it or set HOST=$dns_record_content instead."
        exit 1
    fi

    # If not asked to create a record, stops
    if [[ -z $FORCE_CREATE ]]; then
        echo >&2 "Error: No existing record. Set FORCE_CREATE to any value to force its creation."
        exit 1
    fi

    # Creates a new record
    echo "Creating new record for host $HOST"

    dns_record_response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records" \
            -H "X-Auth-Email: $EMAIL" \
            -H "X-Auth-Key: $API" \
            -H "Content-Type: application/json" \
            --data "$new_dns_record")
else
    # If a record is found, updates the existing record
    echo "Updating record $dns_record_id for host $HOST"

    dns_record_response=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records/$dns_record_id" \
            -H "X-Auth-Email: $EMAIL" \
            -H "X-Auth-Key: $API" \
            -H "Content-Type: application/json" \
            --data "$new_dns_record")
fi

if [[  $(jq <<<"$dns_record_response" -r '.success') = "true" ]]; then
    # Records the IP set set if successful
    echo "IP changed to: $ip"
    echo "$ip" > $ip_file
else
    # Prints out error messages if unsuccessful
    messages=$(jq <<<"$dns_record_response" -r '[.errors[] | .error.message] |join(" - ")')
    echo >&2 "Error: $messages"
    exit 1
fi
