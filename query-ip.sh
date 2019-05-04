#!/bin/bash

ipv4Services=(
    "http://ipv4.whatismyip.akamai.com"
    "http://icanhazip.com/"
    "https://tnx.nl/ip"
    "https://v4.ident.me/"
    "http://ipv4bot.whatismyipaddress.com/"
    "http://ipecho.net/plain" # This service only supports IPv4
)

ipv6Services=(
    "http://ipv6.whatismyip.akamai.com"
    "http://icanhazip.com/"
    "https://tnx.nl/ip"
    "https://v6.ident.me/"
    "http://ipv6bot.whatismyipaddress.com/"
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
    [ $ipVersion == 6 ] && ipServices=("${ipv6Services[@]}") || ipServices=("${ipv4Services[@]}")

    local len=${#ipServices[@]} # Total number of available services
    local retry=$len
    local i=$((RANDOM % ${#ipServices[@]})) # Randomise initial service to try

    # On each iteration, attempt to obtain IP address.
    while [ $retry -gt 0 ] && [ -z $ip ]; do
        echo >&2 "Attempting to obtain IPv${ipVersion} address from ${ipServices[$i]}"
        ip=$(curl -${ipVersion}s ${ipServices[$i]})

        retry=$(($retry - 1)); # Decrement retry attemps until there are none left
        i=$((($i + 1) % $len)); # Pick the next service to try from the list
    done

    [ -z $ip ] && echo >&2 "Failed to obtain IPv${ipVersion} address"
    echo $ip
}
