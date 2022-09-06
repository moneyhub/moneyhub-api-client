import {ApiResponse, SearchParams} from "../../request"
import {Project, ProjectPatch, ProjectPost} from "../../schema/project"

export interface ProjectsRequests {
  getProjects: ({
    userId,
    params,
  }: {
    userId: string
    params?: SearchParams
  }) => Promise<ApiResponse<Project[]>>

  getProject: ({
    userId,
    projectId,
  }: {
    userId: string
    projectId: string
  }) => Promise<ApiResponse<Project>>

  addProject: ({
    userId,
    project,
  }: {
    userId: string
    project: ProjectPost
  }) => Promise<ApiResponse<Project>>

  updateProject: ({
    userId,
    projectId,
    project,
  }: {
    userId: string
    projectId: string
    project: ProjectPatch
  }) => Promise<ApiResponse<Project>>

  deleteProject: ({
    userId,
    projectId,
  }: {
    userId: string
    projectId: string
  }) => Promise<number>
}
