// Reads an auth code, or a redirect URL / query string that contains one.
// A literal "+" in the code or state must be kept: URLSearchParams treats it as a space.
function decodeQueryComponent(value) {
  return decodeURIComponent(value.replace(/\+/g, "%2B"))
}

function firstParam(search, name) {
  const query = search.startsWith("?") ? search.slice(1) : search
  for (const part of query.split("&")) {
    if (!part) continue
    const eq = part.indexOf("=")
    const key = decodeQueryComponent(eq === -1 ? part : part.slice(0, eq))
    if (key !== name) continue
    return eq === -1 ? "" : decodeQueryComponent(part.slice(eq + 1))
  }
  return null
}

function parseCallbackArg(arg, defaultState = "foo") {
  let code = arg
  let state = defaultState
  try {
    const isQuery = arg.startsWith("?") || arg.startsWith("code=")
    if (arg.includes("://") || isQuery) {
      const search = arg.includes("://")
        ? new URL(arg).search
        : "?" + arg.replace(/^\?/, "")
      code = firstParam(search, "code") || code
      state = firstParam(search, "state") || state
    }
  } catch (e) { /* treat arg as a raw code */ }
  return {code, state}
}

module.exports = {parseCallbackArg}
