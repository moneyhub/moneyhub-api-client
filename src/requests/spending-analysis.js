module.exports = ({config, request}) => {
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
