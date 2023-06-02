import {RequestsParams} from "../request"
import {SpendingGoalsRequests} from "./types/spending-goals"

export default ({config, request}: RequestsParams): SpendingGoalsRequests => {
  const {resourceServerUrl} = config
  const spendingGoalsEndpoint = resourceServerUrl + "/spending-goals"

  return {
    getSpendingGoals: async (params = {}, userId, options) =>
      request(spendingGoalsEndpoint, {
        searchParams: params,
        cc: {
          scope: "spending_goals:read",
          sub: userId,
        },
        options,
      }),
    getSpendingGoal: async ({goalId, userId}, options) =>
      request(`${spendingGoalsEndpoint}/${goalId}`, {
        cc: {
          scope: "spending_goals:read",
          sub: userId,
        },
        options,
      }),
    createSpendingGoal: async ({categoryId, periodType, periodStart, amount, userId}, options) =>
      request(spendingGoalsEndpoint, {
        method: "POST",
        cc: {
          scope: "spending_goals:read spending_goals:write:all",
          sub: userId,
        },
        body: {categoryId, periodType, periodStart, amount},
        options,
      }),
    updateSpendingGoal: async ({goalId, categoryId, amount, userId}, options) =>
      request(`${spendingGoalsEndpoint}/${goalId}`, {
        method: "PATCH",
        cc: {
          scope: "spending_goals:read spending_goals:write",
          sub: userId,
        },
        body: {categoryId, amount},
        options,
      }),
    deleteSpendingGoal: async ({goalId, userId}, options) =>
      request(`${spendingGoalsEndpoint}/${goalId}`, {
        method: "DELETE",
        cc: {
          scope: "spending_goals:write:all",
          sub: userId,
        },
        returnStatus: true,
        options,
      }),
  }
}
