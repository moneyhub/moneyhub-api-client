enum Type {
  PROPERTY = "PropertyProject",
  RENTAL = "RentalProject",
  GENERIC = "GenericProject"
}

export interface ProjectPatch {
  name?: string
  accountIds?: string[]
  type?: Type
  archived?: boolean
}

export interface ProjectPost {
  name: string
  accountIds?: string[]
  type: Type
}

export interface Project {
  id: string
  name: string
  type: Type
  dateCreated?: string
  archived?: boolean
}
