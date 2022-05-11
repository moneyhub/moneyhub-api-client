module.exports = ({config, request}) => {
  const {resourceServerUrl} = config
  const spendingGoalsEndpoint = resourceServerUrl + "/spending-goals"

  return {
    getSpendingGoals: async (params = {}) =>
      request(spendingGoalsEndpoint, {
        searchParams: params,
        cc: {
          scope: "spending_goals:read",
        },
      }),
    getSpendingGoal: async ({goalId}) =>
      request(`${spendingGoalsEndpoint}/${goalId}`, {
        cc: {
          scope: "spending_goals:read",
        },
      }),
    createSpendingGoal: async ({categoryId, periodType, periodStart, amount}) =>
      request(spendingGoalsEndpoint, {
        method: "POST",
        cc: {
          scope: "spending_goals:read spending_goals:write:all",
        },
        body: {categoryId, periodType, periodStart, amount},
      }),
    updateSpendingGoal: async ({goalId, categoryId, amount}) =>
      request(`${spendingGoalsEndpoint}/${goalId}`, {
        method: "PATCH",
        cc: {
          scope: "spending_goals:read spending_goals:write",
        },
        body: {categoryId, amount},
      }),
    deleteSpendingGoal: async ({goalId}) =>
      request(`${spendingGoalsEndpoint}/${goalId}`, {
        method: "DELETE",
        cc: {
          scope: "spending_goals:write:all",
        },
      }),
  }
}
