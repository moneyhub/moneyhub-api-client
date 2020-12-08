const R = require("ramda")

module.exports = ({config, request}) => {
  const {resourceServerUrl} = config

  return {
    getTaxReturn: (userId, startDate, endDate, {accountId, projectId} = {}) =>
      request(`${resourceServerUrl}/tax`, {
        searchParams: R.reject(R.isNil)({
          startDate,
          endDate,
          accountId,
          projectId,
        }),
        cc: {
          scope: "tax:read",
          sub: userId,
        },
      }),
  }
}
