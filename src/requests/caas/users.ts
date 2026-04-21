import {RequestsParams} from "../../request"
import {CaasUsersRequests} from "./types/users"

export default ({config, request}: RequestsParams): CaasUsersRequests => {
  const {caasResourceServerUrl} = config

  return {
    caasDeleteUser: ({userId}, options) => {
      return request<number>(
        `${caasResourceServerUrl}/users/${userId}`,
        {
          method: "DELETE",
          cc: {
            scope: "caas:users:delete",
          },
          returnStatus: true,

          options,
        },
      )
    },
  }
}
