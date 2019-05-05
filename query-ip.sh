#!/bin/bash

ipv4Services=(
    "http://ipv4.whatismyip.akamai.com"
    "http://ipv4bot.whatismyipaddress.com/"
    "http://icanhazip.com/"
    "http://ipecho.net/plain" # This service only supports IPv4
    "https://tnx.nl/ip"
    "https://v4.ident.me/"
)

ipv6Services=(
    "http://ipv6.whatismyip.akamai.com"
    "http://ipv6bot.whatismyipaddress.com/"
    "http://icanhazip.com/"
    "https://tnx.nl/ip"
    "https://v6.ident.me/"
)

# Public: Query public IP address for the current system
#
# Takes a single argument representing the IP address version desired
# and attempts to fetch the IP from one of a predefined list of services
#
# $1 - IP version: 4 (default) or 6.
#
# Examples
#
#   queryIPAddress 4
#
# Outputs the IPv4 address to stdout
#
#   queryIPAddress 6
#
# Outputs the IPv6 address to stdout
queryIPAddress() {
    local ipVersion="${1:-4}" # Default to version 4
    local ipServices
    local ip

    # Select IPv4 or IPv6 services to query
    [[ $ipVersion == 6 ]] && ipServices=("${ipv6Services[@]}") || ipServices=("${ipv4Services[@]}")

    # On each iteration, attempt to obtain IP address.
    for ipService in "${ipServices[@]}"; do
        echo >&2 "Attempting to obtain IPv${ipVersion} address from ${ipService}"
        ip=$(curl -${ipVersion}s $ipService)
        [[ -n $ip ]] && break
        echo >&2 "Failed to obtain IPv${ipVersion} address from ${ipService}"
    done

    [[ -z $ip ]] && echo >&2 "Failed to obtain IPv${ipVersion} address from any service."
    echo $ip
}
