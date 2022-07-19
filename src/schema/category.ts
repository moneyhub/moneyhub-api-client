export interface Category {
  categoryId: string
  name?: string
  key?: string
  group: string
}

export interface CategoryGroup {
  id: string
  key: string
}

export interface CategoryPost {
  name: string
  group: string
}

export type CategoryType =
  | "personal"
  | "business"
  | "all"
