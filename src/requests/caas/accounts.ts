import {RequestsParams} from "../../request"
import {CaasAccountsRequests} from "./types/accounts"

export default ({config, request}: RequestsParams): CaasAccountsRequests => {
  const {caasResourceServerUrl} = config

  return {
    caasDeleteAccount: ({accountId}, options) => {
      return request<number>(
        `${caasResourceServerUrl}/accounts/${accountId}`,
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
