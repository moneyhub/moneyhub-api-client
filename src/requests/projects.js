module.exports = ({config, request}) => {
  const {resourceServerUrl} = config

  return {
    getProjects: async ({userId, params = {}}) =>
      request(`${resourceServerUrl}/projects`, {
        searchParams: params,
        cc: {
          scope: "projects:read",
          sub: userId,
        },
      }),
    getProject: async ({userId, projectId}) =>
      request(`${resourceServerUrl}/projects/${projectId}`, {
        cc: {
          scope: "projects:read",
          sub: userId,
        },
      }),

    addProject: async ({userId, project}) =>
      request(`${resourceServerUrl}/projects`, {
        method: "POST",
        cc: {
          scope: "projects:write",
          sub: userId,
        },
        body: project,
      }),

    updateProject: async ({userId, projectId, project}) =>
      request(`${resourceServerUrl}/projects/${projectId}`, {
        method: "PATCH",
        cc: {
          scope: "projects:write",
          sub: userId,
        },
        body: project,
      }),

    deleteProject: async ({userId, projectId}) =>
      request(`${resourceServerUrl}/projects/${projectId}`, {
        method: "DELETE",
        cc: {
          scope: "projects:delete",
          sub: userId,
        },
        returnStatus: true,
      }),
  }
}
