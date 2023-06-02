import {RequestsParams} from "../request"
import {SavingsGoalsRequests} from "./types/savings-goals"

export default ({config, request}: RequestsParams): SavingsGoalsRequests => {
  const {resourceServerUrl} = config
  const savingsGoalsEndpoint = resourceServerUrl + "/savings-goals"

  return {
    getSavingsGoals: async (params = {}, userId, options) =>
      request(savingsGoalsEndpoint, {
        searchParams: params,
        cc: {
          scope: "savings_goals:read",
          sub: userId,
        },
        options,
      }),
    getSavingsGoal: async ({goalId, userId}, options) =>
      request(`${savingsGoalsEndpoint}/${goalId}`, {
        cc: {
          scope: "savings_goals:read",
          sub: userId,
        },
        options,
      }),
    createSavingsGoal: async ({name, imageUrl, notes, accounts, amount, userId}, options) =>
      request(savingsGoalsEndpoint, {
        method: "POST",
        cc: {
          scope: "savings_goals:read savings_goals:write:all",
          sub: userId,
        },
        body: {name, imageUrl, notes, accounts, amount},
        options,
      }),
    updateSavingsGoal: async ({goalId, name, amount, imageUrl, notes, accounts, userId}, options) =>
      request(`${savingsGoalsEndpoint}/${goalId}`, {
        method: "PATCH",
        cc: {
          scope: "savings_goals:read savings_goals:write",
          sub: userId,
        },
        body: {name, amount, imageUrl, notes, accounts},
        options,
      }),
    deleteSavingsGoal: async ({goalId, userId}, options) =>
      request(`${savingsGoalsEndpoint}/${goalId}`, {
        method: "DELETE",
        cc: {
          scope: "savings_goals:write:all",
          sub: userId,
        },
        returnStatus: true,
        options,
      }),
  }
}
