function strictUriEncode(value: unknown): string {
  return encodeURIComponent(String(value)).replace(
    /[!'()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  )
}

function encodeEntry(key: string, value: unknown): string {
  if (value === null) return strictUriEncode(key)
  return `${strictUriEncode(key)}=${strictUriEncode(value)}`
}

/**
 * Serialises a query object the same way query-string v7 does with its defaults:
 * sorted keys, repeated keys for arrays, and strict URI encoding.
 * @param {Record<string, unknown> | null} [object] Query parameters to encode.
 * @returns {string} Encoded query string, without a leading `?`.
 */
export function stringify(object?: Record<string, unknown> | null): string {
  if (!object) return ""

  return Object.keys(object)
    .filter((key) => object[key] !== undefined)
    .sort()
    .map((key) => {
      const value = object[key]
      if (Array.isArray(value)) {
        return value
          .filter((item) => item !== undefined)
          .map((item) => encodeEntry(key, item))
          .join("&")
      }
      return encodeEntry(key, value)
    })
    .filter((part) => part.length > 0)
    .join("&")
}
