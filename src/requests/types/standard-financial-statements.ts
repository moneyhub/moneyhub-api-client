import type {ApiResponse, ExtraOptions} from "../../request"
import type {StandardFinancialStatement, StandardFinancialStatementsMetadata} from "../../schema/standard-financial-statement"

export interface StandardFinancialStatementsSearchParams {
  limit?: number
  offset?: number
}

export interface StandardFinancialStatementsRequests {

  /** List standard financial statement reports for a user. Scope: `standard_financial_statement:read`. */
  getStandardFinancialStatements: (
    {userId, params}: {userId: string, params?: StandardFinancialStatementsSearchParams},
    options?: ExtraOptions,
  ) => Promise<ApiResponse<StandardFinancialStatementsMetadata[]>>

  /** Get a single standard financial statement by report id. Scope: `standard_financial_statement:read`. */
  getStandardFinancialStatement: (
    {userId, reportId}: {userId: string, reportId: string},
    options?: ExtraOptions,
  ) => Promise<ApiResponse<StandardFinancialStatement>>
}
