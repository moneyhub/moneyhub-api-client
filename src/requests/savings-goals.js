module.exports = ({config, request}) => {
  const {resourceServerUrl} = config
  const savingsGoalsEndpoint = resourceServerUrl + "/savings-goals"

  return {
    getSavingsGoals: async (params = {}, userId) =>
      request(savingsGoalsEndpoint, {
        searchParams: params,
        cc: {
          scope: "savings_goals:read",
          sub: userId,
        },
      }),
    getSavingsGoal: async ({goalId, userId}) =>
      request(`${savingsGoalsEndpoint}/${goalId}`, {
        cc: {
          scope: "savings_goals:read",
          sub: userId,
        },
      }),
    createSavingsGoal: async ({name, imageUrl, notes, accounts, amount, userId}) =>
      request(savingsGoalsEndpoint, {
        method: "POST",
        cc: {
          scope: "savings_goals:read savings_goals:write:all",
          sub: userId,
        },
        body: {name, imageUrl, notes, accounts, amount},
      }),
    updateSavingsGoal: async ({goalId, name, amount, imageUrl, notes, accounts, userId}) =>
      request(`${savingsGoalsEndpoint}/${goalId}`, {
        method: "PATCH",
        cc: {
          scope: "savings_goals:read savings_goals:write",
          sub: userId,
        },
        body: {name, amount, imageUrl, notes, accounts},
      }),
    deleteSavingsGoal: async ({goalId, userId}) =>
      request(`${savingsGoalsEndpoint}/${goalId}`, {
        method: "DELETE",
        cc: {
          scope: "savings_goals:write:all",
          sub: userId,
        },
        returnStatus: true
      }),
  }
}