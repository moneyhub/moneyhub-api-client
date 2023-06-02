import {ApiResponse, ExtraOptions, SearchParams} from "../../request"
import {Project, ProjectPatch, ProjectPost} from "../../schema/project"

export interface ProjectsRequests {
  getProjects: ({
    userId,
    params,
  }: {
    userId: string
    params?: SearchParams
  }, options?: ExtraOptions) => Promise<ApiResponse<Project[]>>

  getProject: ({
    userId,
    projectId,
  }: {
    userId: string
    projectId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<Project>>

  addProject: ({
    userId,
    project,
  }: {
    userId: string
    project: ProjectPost
  }, options?: ExtraOptions) => Promise<ApiResponse<Project>>

  updateProject: ({
    userId,
    projectId,
    project,
  }: {
    userId: string
    projectId: string
    project: ProjectPatch
  }, options?: ExtraOptions) => Promise<ApiResponse<Project>>

  deleteProject: ({
    userId,
    projectId,
  }: {
    userId: string
    projectId: string
  }, options?: ExtraOptions) => Promise<number>
}
