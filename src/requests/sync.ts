import {reject, isNil} from "ramda"
import {RequestsParams} from "../request"
import {SyncRequests} from "./types/sync"
const filterUndefined = reject(isNil)

export default ({config, request}: RequestsParams): SyncRequests => {
  const {resourceServerUrl} = config

  return {
    syncUserConnection: ({
      userId,
      connectionId,
      customerIpAddress,
      customerLastLoggedTime,
      enableAsync,
    }, options) =>
      request(`${resourceServerUrl}/sync/${connectionId}`, {
        method: "POST",
        body: filterUndefined({customerIpAddress, customerLastLoggedTime, enableAsync}),
        cc: {
          scope: "accounts:read accounts:write:all",
          sub: userId,
        },
        options,
      }),
  }
}
