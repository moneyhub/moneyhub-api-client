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
      request(`${resourceServerUrl}/projects/${projectId}`, {
        method: "PATCH",
        cc: {
          scope: "projects:write",
          sub: userId,
        },
        body: projectBody,
      }),

    deleteProject: async (userId, projectId) =>
      request(`${resourceServerUrl}/projects/${projectId}`, {
        method: "DELETE",
        cc: {
          scope: "projects:write",
          sub: userId,
        },
        returnStatus: true,
      }),
  }
}
