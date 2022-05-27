import * as R from "ramda"
import {RequestsParams} from "../../types/request"
import {SyncRequests} from "../../types/requests/sync"
const filterUndefined = R.reject(R.isNil)

export default ({config, request}: RequestsParams): SyncRequests => {
  const {resourceServerUrl} = config

  return {
    syncUserConnection: ({
      userId,
      connectionId,
      customerIpAddress,
      customerLastLoggedTime,
    }) =>
      request(`${resourceServerUrl}/sync/${connectionId}`, {
        method: "POST",
        body: filterUndefined({customerIpAddress, customerLastLoggedTime}),
        cc: {
          scope: "accounts:read accounts:write:all",
          sub: userId,
        },
      }),
  }
}
