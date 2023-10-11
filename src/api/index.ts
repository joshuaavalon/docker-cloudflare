import { TypeCompiler } from "@sinclair/typebox/compiler";
import { SchemaViolationError } from "#error";
import { apiResponse } from "./cloudflare/index.js";
import { CloudflareApiError } from "./error.js";
import * as listDnsRecords from "./list-dns-records.js";
import * as listZones from "./list-zones.js";
import * as createDnsRecord from "./create-dns-record.js";
import * as updateDnsRecord from "./update-dns-record.js";

import type { Static, TSchema } from "@sinclair/typebox";
import type { ApiFn, PathFn } from "./type.js";

export interface CloudflareApiOptions {
  baseUrl: string;
  apiToken: string;
  headers?: string;
  timeout: number;
}

interface CreateApiOptions<
  TParams extends TSchema,
  TQuery extends TSchema,
  TBody extends TSchema,
  TResponse extends TSchema
> {
  params: TParams;
  query: TQuery;
  body: TBody;
  response: TResponse;
  method: string;
  pathFn: PathFn<Static<TParams>>;
}

export class CloudflareApi {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;
  private readonly timeout: number;

  public constructor(opts: CloudflareApiOptions) {
    const { baseUrl, apiToken, timeout } = opts;
    this.baseUrl = baseUrl;
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`
    };
    this.timeout = timeout;
  }

  private createApi<
    TParams extends TSchema,
    TQuery extends TSchema,
    TBody extends TSchema,
    TResponse extends TSchema
  >(
    opts: CreateApiOptions<TParams, TQuery, TBody, TResponse>
  ): ApiFn<TParams, TQuery, TBody, TResponse> {
    const { params, query, body, response, method, pathFn } = opts;
    const paramsSchema = TypeCompiler.Compile(params);
    const querySchema = TypeCompiler.Compile(query);
    const bodySchema = TypeCompiler.Compile(body);
    const responseSchema = TypeCompiler.Compile(response);
    const errorSchema = TypeCompiler.Compile(apiResponse);
    return async (ctx, params, query, body) => {
      if (!paramsSchema.Check(params)) {
        throw new SchemaViolationError(paramsSchema, params);
      }
      if (!querySchema.Check(query)) {
        throw new SchemaViolationError(querySchema, query);
      }
      if (!bodySchema.Check(body)) {
        throw new SchemaViolationError(bodySchema, body);
      }
      const path = pathFn(params);
      const url = new URL(this.baseUrl + path);
      const logger = ctx.logger.child({ module: "api", method, path, url });
      if (query) {
        url.search = new URLSearchParams(query).toString();
      }
      logger.debug(
        { headers: this.headers, params, query, body },
        "Start fetch"
      );
      const res = await fetch(url.toString(), {
        method,
        headers: this.headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: this.timeout > 0 ? AbortSignal.timeout(this.timeout) : undefined
      });
      if (res.status !== 200) {
        const json = await res.json();
        logger.debug({ status: res.status, json }, "End fetch");
        if (errorSchema.Check(json)) {
          throw new CloudflareApiError(json.errors);
        } else {
          throw new SchemaViolationError(errorSchema, json);
        }
      }
      const json = await res.json();
      logger.debug({ status: res.status, json }, "End fetch");
      if (!responseSchema.Check(json)) {
        if (errorSchema.Check(json)) {
          throw new CloudflareApiError(json.errors);
        } else {
          throw new SchemaViolationError(errorSchema, json);
        }
      }
      return json;
    };
  }

  public listDnsRecords = this.createApi(listDnsRecords);
  public listZones = this.createApi(listZones);
  public createDnsRecord = this.createApi(createDnsRecord);
  public updateDnsRecord = this.createApi(updateDnsRecord);
}

export * from "./cloudflare/index.js";
