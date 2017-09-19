import json
from os import environ, getenv
from time import sleep

from requests import get, put


def get_request_header(email, api_key):
    return {
        "X-Auth-Email": email,
        "X-Auth-Key": api_key,
        "Content-Type": "application/json"
    }


def print_error(result):
    for error in result["errors"]:
        print(Exception(error))


def get_zone_id(headers, host_name):
    params = {"name": host_name}
    response = get("https://api.cloudflare.com/client/v4/zones", params=params, headers=headers)
    result = response.json()
    if result["success"]:
        return result["result"][0]["id"]
    else:
        print_error(result)
        return None


def get_record_id(headers, zone_id, host_name):
    params = {"name": host_name}
    response = get(f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records", params=params,
                   headers=headers)
    result = response.json()
    if result["success"]:
        return result["result"][0]["id"]
    else:
        print_error(result)
        return None


def update_dns(headers, zone_id, record_id, host_name, ip, ttl, proxy):
    data = {"type": "A", "name": host_name, "content": ip, "ttl": ttl, "proxied": proxy}
    response = put(f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records/{record_id}",
                   data=json.dumps(data), headers=headers)
    result = response.json()
    if result["success"]:
        return True
    else:
        print_error(result)
        return False


def get_ip():
    return get(getenv("IP_ECHO", "http://ipecho.net/plain")).text  # http://icanhazip.com Also works


def update(ip):
    email = environ["EMAIL"]
    api_key = environ["API"]
    host_name = environ["HOST"]
    headers = get_request_header(email, api_key)
    zone_id = get_zone_id(headers, host_name)
    if zone_id is None:
        return
    record_id = get_record_id(headers, zone_id, host_name)
    if record_id is None:
        return
    ttl = int(getenv("TTL", "1"))
    proxy = getenv("PROXY", "True").lower() == "true"
    result = update_dns(headers, zone_id, record_id, host_name, ip, ttl, proxy)
    if result:
        print(f"Update Success:{host_name}({ip})")
    else:
        print(Exception(f"Update Fail:{host_name}({ip})"))


def main():
    ip = None
    new_ip = get_ip()
    while True:
        if ip != new_ip:
            update(new_ip)
            ip = new_ip
        sleep(int(getenv("WAIT", 300)))
        new_ip = get_ip()


if __name__ == "__main__":
    main()
