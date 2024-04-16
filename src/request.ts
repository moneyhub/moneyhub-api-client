import got, {Options, Headers, OptionsOfJSONResponseBody} from "got"
import {Client} from "openid-client"
import qs from "query-string"
import * as R from "ramda"

import type {ApiClientConfig} from "./schema/config"
import {DEFAULT_API_VERSION} from "../examples/constants"

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
}

const getResponseBody = (err: unknown) => {
  let body: {
    code?: string
    message?: string
    details?: string
  } = {}
  try {
    const {code, message, details} = JSON.parse(R.pathOr("{}", ["response", "body"], err))
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
  const urlWithVersion = R.pipe(
    R.split("/"), // split url [ "https:", "", "test.com", "path", "path2" ]
    R.insert(3, String(version)), // insert and stringify version after domain
    R.join("/"), // join url back together with slash
  )(url)

  return urlWithVersion
}

export default ({
  client,
  options: {timeout, apiVersioning},
}: {
  client: Client
  options: {
    timeout?: number
    apiVersioning: boolean
  }
// eslint-disable-next-line max-statements, complexity
}) => async <T>(
  url: string,
  opts: RequestOptions = {},
): Promise<T> => {
  const gotOpts: OptionsOfJSONResponseBody = {
    method: opts.method || "GET",
    headers: opts.headers || {},
    searchParams: qs.stringify(opts.searchParams),
    timeout,
  }

  const formattedUrl = addVersionToUrl(url, apiVersioning, opts.options?.version)

  if (opts.options?.token) {
    gotOpts.headers = R.assoc("Authorization", `Bearer ${opts.options.token}`, gotOpts.headers)
  }

  if (opts.options?.headers) {
    gotOpts.headers = R.mergeDeepRight(gotOpts.headers || {}, opts.options.headers) as Headers
  }

  if (!gotOpts.headers?.Authorization && opts.cc) {
    const {access_token} = await client.grant({
      grant_type: "client_credentials",
      scope: opts.cc.scope,
      sub: opts.cc.sub,
    })
    gotOpts.headers = R.assoc("Authorization", `Bearer ${access_token}`, gotOpts.headers)
  }

  if (opts.body) {
    (gotOpts as any).json = opts.body
  }

  if (opts.form) {
    (gotOpts as any).form = opts.form
  }

  if (opts.formData) {
    (gotOpts as any).body = opts.formData
  }

  const req = got<T>(formattedUrl, gotOpts)
  if (opts.returnStatus) {
    return (req as any).then((res: any) => res.statusCode)
      .catch(attachErrorDetails)
  }

  return (req as any).json()
    .catch(attachErrorDetails)
}
