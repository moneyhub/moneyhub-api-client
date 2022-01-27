import type { RequestsParams } from "..";
import type { RequestOptions } from "../request";

export type ProjectsRequestsParams = RequestsParams;

export default function ProjectsRequests({ config, request }: ProjectsRequestsParams): ProjectsRequests;

interface ProjectsRequests {
  getProjects: ({ userId, params = {}}: { userId: string; params?: RequestOptions["searchParams"]}) => Promise<unknown>;
  getProject: ({ userId, projectId }: { userId: string; projectId: string }) => Promise<unknown>;
  addProject: ({ userId, project }: { userId: string; project: Record<string, any> }) => Promise<unknown>;
  updateProject: ({ userId, projectId, project}: { userId: string; projectId: string; project: Record<string, any>}) => Promise<unknown>;
  deleteProject: ({ userId, projectId }: { userId: string; projectId: string }) => Promise<unknown>;
}
