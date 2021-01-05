const R = require("ramda")

module.exports = ({config, request}) => {
  const {resourceServerUrl} = config

  return {
    getTaxReturn: ({userId, params}) =>
      request(`${resourceServerUrl}/tax`, {
        searchParams: R.reject(R.isNil)(params),
        cc: {
          scope: "tax:read",
          sub: userId,
        },
      }),
  }
}
