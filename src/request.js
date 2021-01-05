const got = require("got")

module.exports = ({client}) => async (url, opts = {}) => {
  const gotOpts = {
    method: opts.method || "GET",
    headers: opts.headers || {},
    searchParams: opts.searchParams,
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
  }

  return req.json()
}
