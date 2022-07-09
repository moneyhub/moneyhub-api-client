import {RequestsParams} from "src/request"
import {SpendingGoalsRequests} from "../../types/requests/spending-goals"

export default ({config, request}: RequestsParams): SpendingGoalsRequests => {
  const {resourceServerUrl} = config
  const spendingGoalsEndpoint = resourceServerUrl + "/spending-goals"

  return {
    getSpendingGoals: async (params = {}, userId) =>
      request(spendingGoalsEndpoint, {
        searchParams: params,
        cc: {
          scope: "spending_goals:read",
          sub: userId,
        },
      }),
    getSpendingGoal: async ({goalId, userId}) =>
      request(`${spendingGoalsEndpoint}/${goalId}`, {
        cc: {
          scope: "spending_goals:read",
          sub: userId,
        },
      }),
    createSpendingGoal: async ({categoryId, periodType, periodStart, amount, userId}) =>
      request(spendingGoalsEndpoint, {
        method: "POST",
        cc: {
          scope: "spending_goals:read spending_goals:write:all",
          sub: userId,
        },
        body: {categoryId, periodType, periodStart, amount},
      }),
    updateSpendingGoal: async ({goalId, categoryId, amount, userId}) =>
      request(`${spendingGoalsEndpoint}/${goalId}`, {
        method: "PATCH",
        cc: {
          scope: "spending_goals:read spending_goals:write",
          sub: userId,
        },
        body: {categoryId, amount},
      }),
    deleteSpendingGoal: async ({goalId, userId}) =>
      request(`${spendingGoalsEndpoint}/${goalId}`, {
        method: "DELETE",
        cc: {
          scope: "spending_goals:write:all",
          sub: userId,
        },
        returnStatus: true,
      }),
  }
}
