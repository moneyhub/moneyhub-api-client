import type {ApiResponse, ExtraOptions} from "../../request"
import type {StandardFinancialStatement, StandardFinancialStatementsMetadata} from "../../schema/standard-financial-statement"

export interface StandardFinancialStatementsSearchParams {
  limit?: number
  offset?: number
}

export interface StandardFinancialStatementsRequests {
  getStandardFinancialStatements: (
    {userId, params}: {userId: string; params?: StandardFinancialStatementsSearchParams},
    options?: ExtraOptions,
  ) => Promise<ApiResponse<StandardFinancialStatementsMetadata[]>>

  getStandardFinancialStatement: (
    {userId, reportId}: {userId: string; reportId: string},
    options?: ExtraOptions,
  ) => Promise<ApiResponse<StandardFinancialStatement>>
}
