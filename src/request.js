const got = require("got")

module.exports = async (url, opts = {}) => {
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
    gotOpts.headers.Authorization =  `Bearer ${access_token}`

  }

  return got(url, gotOpts).json()
}
