#!/bin/bash
#
# Provides a function to query the public IP address for the current system

IPV4_SERVICES=(
    "http://ipv4.whatismyip.akamai.com"
    "http://ipv4bot.whatismyipaddress.com/"
    "http://icanhazip.com/"
    "http://ipecho.net/plain" # This service only supports IPv4
    "https://tnx.nl/ip"
    "https://v4.ident.me/"
)

IPV6_SERVICES=(
    "http://ipv6.whatismyip.akamai.com"
    "http://ipv6bot.whatismyipaddress.com/"
    "http://icanhazip.com/"
    "https://tnx.nl/ip"
    "https://v6.ident.me/"
)


#######################################
# Attempt to query IP addresses from the lists of available services for IPv4 and IPv6
# Globals:
#   IPV4_SERVICES
#   IPV6_SERVICES
# Arguments:
#   ipVersion: 4 (default) or 6.
# Returns:
#   The public IP address corresponding to the specified IP version
#######################################
queryIPAddress() {
    local ipVersion="${1:-4}" # Default to version 4
    local ipServices
    local ip

    # Select IPv4 or IPv6 services to query
    [[ $ipVersion == 6 ]] && ipServices=("${IPV6_SERVICES[@]}") || ipServices=("${IPV4_SERVICES[@]}")

    for ipService in "${ipServices[@]}"; do
        echo >&2 "Attempting to obtain IPv${ipVersion} address from ${ipService}"
        ip=$(curl "-${ipVersion}s" "${ipService}")
        [[ -n $ip ]] && break
        echo >&2 "Failed to obtain IPv${ipVersion} address from ${ipService}"
    done

    [[ -z $ip ]] && echo >&2 "Failed to obtain IPv${ipVersion} address from any service." && return 1
    echo $ip
}
