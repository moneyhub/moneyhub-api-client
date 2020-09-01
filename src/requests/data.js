module.exports = ({config, request}) => {
  const {resourceServerUrl} = config

  return {
    getProjects: async (userId, params = {}) =>
      request(`${resourceServerUrl}/projects`, {
        searchParams: params,
        cc: {
          scope: "projects:read",
          sub: userId,
        },
      }),
    getProject: async (userId, projectId) =>
      request(`${resourceServerUrl}/projects/${projectId}`, {
        cc: {
          scope: "projects:read",
          sub: userId,
        },
      }),

    addProject: async (userId, projectBody) => 
      request(`${resourceServerUrl}/projects`, {
        method: "POST",
        cc: {
          scope: "projects:write",
          sub: userId,
        },
        body: projectBody,
      }),
    
    updateProject: async (userId, projectId, projectBody) => 
      request(`${resourceServerUrl}/projects/%`, {
        method: "PATCH",
        cc: {
          scope: "projects:write",
          sub: userId,
        },
        body: projectBody,
      }),

      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "projects:write",
        sub: userId,
      })

      const url = `${resourceServerUrl}/projects/${projectId}`
      return got
        .patch(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          body: projectBody,
          json: true,
        })
        .then(R.prop("body"))
    },

    deleteProject: async (userId, projectId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "projects:delete",
        sub: userId,
      })

      const url = `${resourceServerUrl}/projects/${projectId}`
      return got
        .delete(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          json: true,
        })
        .then(R.prop("statusCode"))
    },

    addFileToTransaction: async (userId, transactionId, fileData) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "transactions:read:all transactions:write",
        sub: userId,
      })

      const url = `${resourceServerUrl}/transactions/${transactionId}/files`
      const form = new FormData()
      form.append("file", fileData)
      return got
        .post(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          body: form,
        })
        .then(R.compose(JSON.parse, R.prop("body")))
    },

    getTransactionFiles: async (userId, transactionId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "transactions:read:all transactions:write",
        sub: userId,
      })

      const url = `${resourceServerUrl}/transactions/${transactionId}/files`
      return got
        .get(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          json: true,
        })
        .then(R.prop("body"))
    },

    getTransactionFile: async (userId, transactionId, fileId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "transactions:read:all transactions:write",
        sub: userId,
      })

      const url = `${resourceServerUrl}/transactions/${transactionId}/files/${fileId}`
      return got
        .get(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          json: true,
        })
        .then(R.prop("body"))
    },

    deleteTransactionFile: async (userId, transactionId, fileId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "transactions:read:all transactions:write",
        sub: userId,
      })

      const url = `${resourceServerUrl}/transactions/${transactionId}/files/${fileId}`
      return got
        .delete(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          json: true,
        })
        .then(R.prop("statusCode"))
    },

    getTaxReturn: async (
      userId,
      startDate,
      endDate,
      {accountId, projectId} = {},
    ) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "tax:read",
        sub: userId,
      })

      const query = R.reject(R.isNil)({
        startDate,
        endDate,
        accountId,
        projectId,
      })
      const url = `${resourceServerUrl}/tax?${querystring.stringify(query)}`
      return got
        .get(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          json: true,
        })
        .then(R.prop("body"))
    },
  }
}
