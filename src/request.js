const got = require("got")
const R = require("ramda")

const getResponseBody = err => {
  let body = {}
  try {
    const {code, message, details} = JSON.parse(R.pathOr("{}", ["response", "body"], err))
    body = {code, message, details: typeof details === "object" ? JSON.stringify(details) : details}
  // eslint-disable-next-line no-empty
  } catch (e) {
    body = {}
  }

  return body
}

const attachErrorDetails = err => {
  const {code, message, details} = getResponseBody(err)
  err.error = code
  err.error_description = message
  err.error_details = details
  throw err
}

module.exports = ({client, options: {timeout}}) => async (url, opts = {}) => {
  const gotOpts = {
    method: opts.method || "GET",
    headers: opts.headers || {},
    searchParams: opts.searchParams,
    timeout,
  }

  if (opts.cc) {
    const {access_token} = await client.grant({
      grant_type: "client_credentials",
      scope: opts.cc.scope,
      sub: opts.cc.sub,
    })
    gotOpts.headers.Authorization = `Bearer ${access_token}`
  }

  if (opts.body) {
    gotOpts.json = opts.body
  }

  if (opts.form) {
    gotOpts.body = opts.form
  }

  const req = got(url, gotOpts)
  if (opts.returnStatus) {
    return req.then(res => res.statusCode)
      .catch(attachErrorDetails)
  }

  return req.json()
    .catch(attachErrorDetails)
}
