const R = require("ramda")
const filterUndefined = R.reject(R.isNil)

module.exports = ({config, request}) => {
  const {resourceServerUrl} = config

  return {
    syncUserConnection: ({
      userId,
      connectionId,
      customerIpAddress,
      customerLastLoggedTime,
    }) =>
      request(`${resourceServerUrl}/sync/${connectionId}`, {
        body: filterUndefined({customerIpAddress, customerLastLoggedTime}),
        cc: {
          scope: "accounts:read accounts:write:all",
          sub: userId,
        },
      }),
  }
}
