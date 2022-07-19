type ProjectType =
  | "PropertyProject"
  | "RentalProject"
  | "GenericProject"


export interface ProjectPatch {
  name?: string
  accountIds?: string[]
  type?: ProjectType
  archived?: boolean
}

export interface ProjectPost {
  name: string
  accountIds?: string[]
  type: ProjectType
}

export interface Project {
  id: string
  name: string
  type: ProjectType
  dateCreated?: string
  archived?: boolean
}
