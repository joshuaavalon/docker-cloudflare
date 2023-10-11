# IP Echo Service

To get your IP address, this application uses external services. Currently, it uses Cloudflare and ipify.

However, if you are concern with privacy, you can set up your own service. (But you are sending to Cloudflare anyway.)

There are 3 types of responses from IP echo service supported: [`text`](#text), [`ini`](#ini) and [`json`](#json).
You can implement or use services that return response via HTTP GET.

## Text

It should return a string that is IPv4 or IPv6.

**Environment Variables**

```ini
CF_DNS__IPV4_0__TYPE=text
CF_DNS__IPV4_0__URL=https://ipv4.example.com
CF_DNS__IPV4_0__TRIM=false

CF_DNS__IPV6_0__TYPE=text
CF_DNS__IPV6_0__URL=https://ipv6.example.com
CF_DNS__IPV6_0__TRIM=false
```

**YAML**

```yaml
ipv4:
  - type: text
    url: https://ipv6.example.com
    trim: false
ipv6:
  - type: text
    url: https://ipv6.example.com
    trim: false
```

**JSON**

```json
{
  "ipv4": [
    {
      "type": "text",
      "url": "https://ipv6.example.com",
      "trim": false
    }
  ],
  "ipv6": [
    {
      "type": "text",
      "url": "https://ipv6.example.com",
      "trim": false
    }
  ]
}
```

**JavaScript**

```js
export default {
  ipv4: [
    {
      type: "text",
      url: "https://ipv6.example.com",
      trim: false
    }
  ],
  ipv6: [
    {
      type: "text",
      url: "https://ipv6.example.com",
      trim: false
    }
  ]
};
```

### Options

- `trim`: _Optional_ Trim the response text if `true`. Default to `false`.

## Ini

It should return a string that is `<Key>=<Value>` pairs each line.

**Environment Variables**

```ini
CF_DNS__IPV4_0__TYPE=ini
CF_DNS__IPV4_0__URL=https://ipv4.example.com
CF_DNS__IPV4_0__FIELD=ip

CF_DNS__IPV6_0__TYPE=ini
CF_DNS__IPV6_0__URL=https://ipv6.example.com
CF_DNS__IPV6_0__FIELD=ip
```

**YAML**

```yaml
ipv4:
  - type: ini
    url: https://ipv6.example.com
    field: ip
ipv6:
  - type: ini
    url: https://ipv6.example.com
    field: ip
```

**JSON**

```json
{
  "ipv4": [
    {
      "type": "ini",
      "url": "https://ipv6.example.com",
      "field": "ip"
    }
  ],
  "ipv6": [
    {
      "type": "ini",
      "url": "https://ipv6.example.com",
      "field": "ip"
    }
  ]
}
```

**JavaScript**

```js
export default {
  ipv4: [
    {
      type: "ini",
      url: "https://ipv6.example.com",
      field: "ip"
    }
  ],
  ipv6: [
    {
      type: "ini",
      url: "https://ipv6.example.com",
      field: "ip"
    }
  ]
};
```

### Options

- `field`: It is the key of IP address in the response.

## JSON

It should return a valid JSON.

**Environment Variables**

```ini
CF_DNS__IPV4_0__TYPE=json
CF_DNS__IPV4_0__URL=https://ipv4.example.com
CF_DNS__IPV4_0__FIELDS_0=ip

CF_DNS__IPV6_0__TYPE=json
CF_DNS__IPV6_0__URL=https://ipv6.example.com
CF_DNS__IPV6_0__FIELDS_0=ip
```

**YAML**

```yaml
ipv4:
  - type: json
    url: https://ipv6.example.com
    fields:
      - ip
ipv6:
  - type: json
    url: https://ipv6.example.com
    fields:
      - ip
```

**JSON**

```json
{
  "ipv4": [
    {
      "type": "json",
      "url": "https://ipv6.example.com",
      "fields": ["ip"]
    }
  ],
  "ipv6": [
    {
      "type": "json",
      "url": "https://ipv6.example.com",
      "fields": ["ip"]
    }
  ]
}
```

**JavaScript**

```js
export default {
  ipv4: [
    {
      type: "json",
      url: "https://ipv6.example.com",
      fields: ["ip"]
    }
  ],
  ipv6: [
    {
      type: "json",
      url: "https://ipv6.example.com",
      fields: ["ip"]
    }
  ]
};
```

### Options

- `fields`: It is the key of IP address in the response. Multiple values are allowed for nested keys.

## Custom

Only support in JS config.

**JavaScript**

```js
export default {
  ipv4: [
    {
      type: "json",
      url: "https://ipv6.example.com",
      func: (v) => v
    }
  ],
  ipv6: [
    {
      type: "json",
      url: "https://ipv6.example.com",
      func: (v) => v
    }
  ]
};
```

### Options

- `func`: It should accept string and return string
