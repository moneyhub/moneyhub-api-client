import type {RequestsParams} from "../request"
import type {StandardFinancialStatementsRequests} from "./types/standard-financial-statements"

export default ({config, request}: RequestsParams): StandardFinancialStatementsRequests => {
  const {resourceServerUrl} = config

  return {
    getStandardFinancialStatements: async ({userId, params = {}}, options) =>
      request(`${resourceServerUrl}/standard-financial-statements`, {
        searchParams: params,
        cc: {
          scope: "standard_financial_statement:read",
          sub: userId,
        },
        options,
      }),

    getStandardFinancialStatement: async ({userId, reportId}, options) =>
      request(`${resourceServerUrl}/standard-financial-statements/${reportId}`, {
        cc: {
          scope: "standard_financial_statement:read",
          sub: userId,
        },
        options,
      }),
  }
}
