import {ApiResponse} from "src/request"
import {SpendingAnalysis} from "src/schema/spending-analysis"

type Date = {
  name: string
  from: string
  to: string
}

export interface SpendingAnalysisRequests {
  getSpendingAnalysis: ({
    userId,
    dates,
    accountIds,
    categoryIds,
    projectIds,
  }: {
    userId: string
    dates: Date[]
    accountIds?: string[]
    categoryIds?: string[]
    projectIds?: string[]
  }) => Promise<ApiResponse<SpendingAnalysis>>
}