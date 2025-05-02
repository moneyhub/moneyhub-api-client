import {RequestsParams} from "../request"
import {CategoriseTransactionsRequest, CategoriseTransactionsRequests} from "./types/categorise-transactions"

export default ({config, request}: RequestsParams): CategoriseTransactionsRequests => {
  const {resourceServerUrl} = config

  const categoriseTransactions: CategoriseTransactionsRequest = ({
    accountId,
    accountType,
    transactions,
  }, options) =>
    request(`${resourceServerUrl}/categorise-transactions`, {
      method: "POST",
      cc: {
        scope: "categorisation",
      },
      body: {
        accountId,
        accountType,
        transactions,
      },
      options,
    })

  return {
    categoriseTransactions,
  }
}
