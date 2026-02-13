import got, {Options, Headers, OptionsOfJSONResponseBody, Method, Agents} from "got"
import {Client} from "openid-client"
import qs from "query-string"
import {reject, isNil, pathOr, pipe, split, insert, join, assoc, mergeDeepRight} from "ramda"

import type {ApiClientConfig, MutualTLSOptions} from "./schema/config"
const DEFAULT_API_VERSION: Version = "v3"
const DEFAULT_MAX_RETRY_AFTER = 5000
const DEFAULT_RETRY_LIMIT = 2
const DEFAULT_RETRY_METHODS: Method[] = [
  "GET",
  "HEAD",
  "PUT",
  "DELETE",
  "OPTIONS",
  "TRACE",
]
const DEFAULT_RETRY_STATUS_CODES: number[] = [
  408, // Request Timeout
  413, // Payload Too Large
  429, // Too Many Requests
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
  521, // Web Server Is Down
  522, // Connection Timed Out
  524,  // A Timeout Occurred
]

interface RetryOptions {
  limit?: number
  methods?: Method[]
  statusCodes?: number[]
  maxRetryAfter?: number
}

interface RequestOptions extends Pick<Options, "method" | "headers" | "searchParams" | "json" | "form"> {
  searchParams?: any // needed?
  body?: Record<string, any>
  formData?: any
  returnStatus?: boolean
  cc?: {
    scope: string
    sub?: string
  }
  options?: ExtraOptions
  retry?: RetryOptions
}

interface Links {
  next?: string
  prev?: string
  self: string
}

type Version = "v2.0" | "v2" | "v3" | "v3.0"

export type Request = <T>(url: string, opts?: RequestOptions) => Promise<T>

export interface RequestsParams {
  config: ApiClientConfig
  request: Request
}

export interface SearchParams {
  limit?: number
  offset?: number
  counterpartiesVersion?: string
  showTransactionData?: boolean
  showPerformanceScore?: boolean
}

export interface ApiResponse<T> {
  data: T
  links?: Links
  meta?: object
}

export interface ExtraOptions {
  token?: string
  headers?: Headers
  version?: Version
  retry?: RetryOptions
}



const getResponseBody = (err: unknown) => {
  let body: {
    code?: string
    message?: string
    details?: string
  } = {}
  try {
    const {code, message, details} = JSON.parse(pathOr("{}", ["response", "body"], err))
    body = {code, message, details: typeof details === "object" ? JSON.stringify(details) : details}
  } catch (e) {
    body = {}
  }

  return body
}

const attachErrorDetails = (err: unknown) => {
  const {code, message, details} = getResponseBody(err)
  ;(err as any).error = code
  ;(err as any).error_description = message
  ;(err as any).error_details = details
  throw err
}

export const addVersionToUrl = (url: string, apiVersioning: boolean, version: Version = DEFAULT_API_VERSION): string => {
  if (!apiVersioning || url.includes("identity") || /\/v.+/g.test(url)) return url
  const urlWithVersion = pipe(
    split("/"), // split url [ "https:", "", "test.com", "path", "path2" ]
    insert(3, String(version)), // insert and stringify version after domain
    join("/"), // join url back together with slash
  )(url)

  return urlWithVersion
}

const pickRetryValue = <K extends keyof RetryOptions>(
  requestOptions: ExtraOptions,
  retry: RetryOptions,
  key: K,
  defaultValue: NonNullable<RetryOptions[K]>,
): NonNullable<RetryOptions[K]> =>
  (requestOptions.retry?.[key] ?? retry[key] ?? defaultValue) as NonNullable<RetryOptions[K]>

const getRetryOptions = (retry: RetryOptions, requestOptions: ExtraOptions = {}) => ({
  limit: pickRetryValue(requestOptions, retry, "limit", DEFAULT_RETRY_LIMIT),
  methods: pickRetryValue(requestOptions, retry, "methods", DEFAULT_RETRY_METHODS),
  statusCodes: pickRetryValue(requestOptions, retry, "statusCodes", DEFAULT_RETRY_STATUS_CODES),
  maxRetryAfter: pickRetryValue(requestOptions, retry, "maxRetryAfter", DEFAULT_MAX_RETRY_AFTER),
})

const applyAgent = (gotOpts: OptionsOfJSONResponseBody, agent?: Agents) => {
  if (agent) {
    (gotOpts as Options).agent = agent
  }
}

const applyAuthHeaders = (
  gotOpts: OptionsOfJSONResponseBody,
  opts: RequestOptions,
) => {
  if (opts.options?.token) {
    gotOpts.headers = assoc("Authorization", `Bearer ${opts.options.token}`, gotOpts.headers)
  }
  if (opts.options?.headers) {
    gotOpts.headers = mergeDeepRight(gotOpts.headers || {}, opts.options.headers) as Headers
  }
}

const applyClientCredentials = async (
  gotOpts: OptionsOfJSONResponseBody,
  client: Client,
  opts: RequestOptions,
) => {
  if (!gotOpts.headers?.Authorization && opts.cc) {
    const {access_token} = await client.grant({
      grant_type: "client_credentials",
      scope: opts.cc.scope,
      sub: opts.cc.sub,
    })
    gotOpts.headers = assoc("Authorization", `Bearer ${access_token}`, gotOpts.headers)
  }
}

const applyBodyOptions = (gotOpts: OptionsOfJSONResponseBody, opts: RequestOptions) => {
  if (opts.body) {
    (gotOpts as any).json = opts.body
  }
  if (opts.form) {
    (gotOpts as any).form = opts.form
  }
  if (opts.formData) {
    (gotOpts as any).body = opts.formData
  }
}

const applyMTLS = (gotOpts: OptionsOfJSONResponseBody, mTLS?: MutualTLSOptions) => {
  if (mTLS) {
    gotOpts.https = {
      certificate: mTLS.cert,
      key: mTLS.key,
    }
  }
}

interface RequestFactoryParams {
  client: Client
  options: {
    timeout?: number
    apiVersioning: boolean
    agent?: Agents
    mTLS?: MutualTLSOptions
    retry?: RetryOptions
  }
}

async function executeRequest<T>(
  url: string,
  opts: RequestOptions,
  params: RequestFactoryParams,
): Promise<T> {
  const {client, options: {timeout, apiVersioning, agent, mTLS, retry = {}}} = params
  const retryOptions = getRetryOptions(retry, opts.options)

  const gotOpts: OptionsOfJSONResponseBody = {
    method: opts.method || "GET",
    headers: opts.headers || {},
    searchParams: opts.searchParams ? qs.stringify(reject(isNil)(opts.searchParams)) : undefined,
    timeout,
    retry: retryOptions,
  }

  applyAgent(gotOpts, agent)
  const formattedUrl = addVersionToUrl(url, apiVersioning, opts.options?.version)
  applyAuthHeaders(gotOpts, opts)
  await applyClientCredentials(gotOpts, client, opts)
  applyBodyOptions(gotOpts, opts)
  applyMTLS(gotOpts, mTLS)

  const req = got<T>(formattedUrl, gotOpts)
  if (opts.returnStatus) {
    return (req as any).then((res: any) => res.statusCode)
      .catch(attachErrorDetails)
  }

  return (req as any).json()
    .catch(attachErrorDetails)
}

export default (params: RequestFactoryParams): Request => async <T>(
  url: string,
  opts: RequestOptions = {},
): Promise<T> => executeRequest<T>(url, opts, params)
