import type {Options} from "got"
import {ApiClientConfig} from "./config"

export interface GotRequestParams {
  client: any
  options: Options
}

export interface RequestOptions {
  method?: Options["method"]
  headers?: Options["headers"]
  searchParams?: Options["searchParams"] | any
  json?: Options["json"]
  form?: Options["form"]
  body?: Record<string, any>
  returnStatus?: boolean
  cc?: {
    scope: string
    sub?: string
  }
}

export interface RequestsParams {
  config: ApiClientConfig
  request: <T>(url: string, opts?: RequestOptions) => Promise<T>
}

export interface SearchParams {
  limit?: number
  offset?: number
}

interface Links {
  next?: string
  prev?: string
  self: string
}

export interface ApiResponse<T> {
  data: T
  links?: Links
  meta?: object
}
