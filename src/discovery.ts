import got, {Options, OptionsOfJSONResponseBody} from "got"
import type {Agents} from "got"
import type {MutualTLSOptions} from "./schema/config"

export interface DiscoveryOptions {
  timeout?: number
  agent?: Agents
  mTLS?: MutualTLSOptions
}

/**
 * Rewrites any string value in a value (object, array, or primitive) that starts with
 * canonicalBase to use targetBase instead. Does not mutate the original.
 * Used for both OIDC discovery documents and resource server response bodies (e.g. links).
 * @param {*} value - Object, array or primitive to rewrite
 * @param {string} canonicalBase - Base URL to replace
 * @param {string} targetBase - Base URL to use instead
 * @returns {*} A copy of value with matching URLs rewritten
 */
export function rewriteUrlsInObject<T>(
  value: T,
  canonicalBase: string,
  targetBase: string,
): T {
  if (canonicalBase === targetBase) return value

  if (typeof value === "string") {
    if (value.startsWith(canonicalBase)) {
      return (targetBase + value.slice(canonicalBase.length)) as unknown as T
    }
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => rewriteUrlsInObject(item, canonicalBase, targetBase)) as unknown as T
  }

  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = rewriteUrlsInObject(v, canonicalBase, targetBase)
    }
    return out as T
  }

  return value
}

/**
 * Rewrites URL fields in an OIDC discovery document so that endpoint URLs use the
 * target base. Leaves the discovery "issuer" field unchanged so that JWT iss claim
 * validation continues to work when the IdP still issues tokens with the canonical issuer.
 * @param {Object} doc - OIDC discovery document
 * @param {string} canonicalBase - Base URL to replace
 * @param {string} targetBase - Base URL to use instead
 * @returns {Object} Discovery document with endpoint URLs rewritten
 */
export function rewriteDiscoveryUrls(
  doc: Record<string, unknown>,
  canonicalBase: string,
  targetBase: string,
): Record<string, unknown> {
  if (canonicalBase === targetBase) return doc

  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(doc)) {
    if (key === "issuer" && typeof val === "string") {
      result[key] = val
      continue
    }
    result[key] = rewriteUrlsInObject(val, canonicalBase, targetBase)
  }
  return result
}

export interface OpenIDDiscoveryMetadata {
  issuer: string
  authorization_endpoint?: string
  token_endpoint?: string
  jwks_uri?: string
  [key: string]: unknown
}

/**
 * Normalised OIDC base for the given identity service URL (no trailing slash).
 * @param {string} identityServiceUrl - Identity service base URL
 * @returns {string} OIDC base URL with no trailing slash
 */
const oidcBaseFromIdentityUrl = (identityServiceUrl: string): string =>
  (identityServiceUrl.replace(/\/oidc\/?$/, "") + "/oidc").replace(/\/$/, "")

/**
 * Rewrites a discovery document so endpoint URLs use the identity service base (e.g. gateway).
 * Single source of truth for canonical/target computation; used by both initial fetch and cache refresh.
 * @param {string} identityServiceUrl - Identity service base URL (e.g. gateway or https://identity.moneyhub.co.uk)
 * @param {Record<string, unknown>} doc - Raw OIDC discovery document
 * @returns {Record<string, unknown>} Discovery document with endpoint URLs rewritten (issuer unchanged)
 */
export function rewriteDiscoveryDocForIdentityUrl(
  identityServiceUrl: string,
  doc: Record<string, unknown>,
): Record<string, unknown> {
  const issuer = doc?.issuer
  if (!issuer || typeof issuer !== "string") return doc
  const canonicalBase = issuer.replace(/\/$/, "")
  const targetBase = oidcBaseFromIdentityUrl(identityServiceUrl)
  return rewriteDiscoveryUrls(doc, canonicalBase, targetBase)
}

/**
 * Fetches the raw OpenID discovery document from identityServiceUrl/oidc (no URL rewriting).
 * @param {string} identityServiceUrl - Identity service base URL
 * @param {DiscoveryOptions} options - Optional timeout, agent or mTLS settings
 * @returns {Promise<OpenIDDiscoveryMetadata>} Raw OpenID discovery metadata
 */
export async function getDiscovery(
  identityServiceUrl: string,
  options: DiscoveryOptions = {},
): Promise<OpenIDDiscoveryMetadata> {
  const base = oidcBaseFromIdentityUrl(identityServiceUrl)
  const url = `${base}/.well-known/openid-configuration`
  const gotOpts: OptionsOfJSONResponseBody = {
    timeout: options.timeout,
    responseType: "json",
  }
  if (options.agent) {
    (gotOpts as Options).agent = options.agent
  }
  if (options.mTLS) {
    gotOpts.https = {
      certificate: options.mTLS.cert,
      key: options.mTLS.key,
    }
  }
  const doc = (await got(url, gotOpts).json()) as Record<string, unknown>
  return doc as OpenIDDiscoveryMetadata
}

/**
 * Fetches the OpenID discovery document from identityServiceUrl/oidc and rewrites
 * all endpoint URLs (but not the issuer field) to use the configured identity service url, so that
 * when used behind a gateway all OIDC traffic goes through the gateway.
 * @param {string} identityServiceUrl - Identity service URL (e.g. https://identity.moneyhub.co.uk)
 * @param {DiscoveryOptions} options - Optional timeout, agent or mTLS settings
 * @returns {Promise<OpenIDDiscoveryMetadata>} OpenID discovery metadata with URLs rewritten for the gateway
 */
export async function getDiscoveryWithGatewayUrl(
  identityServiceUrl: string,
  options: DiscoveryOptions = {},
): Promise<OpenIDDiscoveryMetadata> {
  const doc = (await getDiscovery(identityServiceUrl, options)) as Record<string, unknown>
  const rewritten = rewriteDiscoveryDocForIdentityUrl(identityServiceUrl, doc)
  return rewritten as OpenIDDiscoveryMetadata
}

/**
 * Infers the canonical API base from a response link URL (e.g. links.self) by taking
 * origin and path up to and including the version segment (e.g. /v3).
 * @param {string} linkUrl - Full link URL from a resource response
 * @returns {string|null} Canonical base URL or null if it cannot be inferred
 */
export function inferCanonicalBaseFromLinkUrl(linkUrl: string): string | null {
  try {
    const u = new URL(linkUrl)
    const pathParts = u.pathname.split("/").filter(Boolean)
    const versionIndex = pathParts.findIndex((p) => /^v\d+(\.\d+)?$/i.test(p))
    if (versionIndex >= 0) {
      const versionPath = "/" + pathParts.slice(0, versionIndex + 1).join("/")
      return `${u.origin}${versionPath}`
    }
    return u.origin
  } catch {
    return null
  }
}

/**
 * Rewrites URL strings in a resource server response body (e.g. links.self, links.next,
 * links.prev) so that any canonical API base is replaced with resourceServerUrl.
 * Returns the body unchanged if no links or no canonical base can be inferred.
 * @param {*} body - Resource server response body (typically with a links property)
 * @param {string} resourceServerUrl - Base URL for the resource server (e.g. gateway URL)
 * @returns {*} Body with link URLs rewritten to use resourceServerUrl
 */
export function rewriteResourceServerResponseUrls<T>(
  body: T,
  resourceServerUrl: string,
): T {
  if (body === null || typeof body !== "object") return body

  const targetBase = resourceServerUrl.replace(/\/$/, "")
  const links = (body as Record<string, unknown>).links as { self?: string, next?: string, prev?: string } | undefined
  if (!links || typeof links.self !== "string") return body

  const canonicalBase = inferCanonicalBaseFromLinkUrl(links.self)
  if (!canonicalBase || canonicalBase === targetBase) return body

  const result = {...(body as Record<string, unknown>)}
  result.links = rewriteUrlsInObject(links, canonicalBase, targetBase)
  return result as unknown as T
}
