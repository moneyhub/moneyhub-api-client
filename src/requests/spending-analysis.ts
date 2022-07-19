import {RequestsParams} from "src/request"
import {SpendingAnalysisRequests} from "./types/spending-analysis"

export default ({config, request}: RequestsParams): SpendingAnalysisRequests => {
  const {resourceServerUrl} = config

  return {
    getSpendingAnalysis: async ({userId, dates, accountIds, categoryIds, projectIds}) => {
      return await request(
        `${resourceServerUrl}/spending-analysis`,
        {
          method: "POST",
          cc: {
            scope: "spending_analysis:read",
            sub: userId,
          },
          body: {dates, accountIds, categoryIds, projectIds},
        },
      )
    },
  }
}
