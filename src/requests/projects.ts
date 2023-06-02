import {RequestsParams} from "../request"
import {ProjectsRequests} from "./types/projects"

export default ({config, request}: RequestsParams): ProjectsRequests => {
  const {resourceServerUrl} = config

  return {
    getProjects: async ({userId, params = {}}, options) =>
      request(`${resourceServerUrl}/projects`, {
        searchParams: params,
        cc: {
          scope: "projects:read",
          sub: userId,
        },
        options,
      }),
    getProject: async ({userId, projectId}, options) =>
      request(`${resourceServerUrl}/projects/${projectId}`, {
        cc: {
          scope: "projects:read",
          sub: userId,
        },
        options,
      }),

    addProject: async ({userId, project}, options) =>
      request(`${resourceServerUrl}/projects`, {
        method: "POST",
        cc: {
          scope: "projects:write",
          sub: userId,
        },
        body: project,
        options,
      }),

    updateProject: async ({userId, projectId, project}, options) =>
      request(`${resourceServerUrl}/projects/${projectId}`, {
        method: "PATCH",
        cc: {
          scope: "projects:write",
          sub: userId,
        },
        body: project,
        options,
      }),

    deleteProject: async ({userId, projectId}, options) =>
      request(`${resourceServerUrl}/projects/${projectId}`, {
        method: "DELETE",
        cc: {
          scope: "projects:delete",
          sub: userId,
        },
        returnStatus: true,
        options,
      }),
  }
}
