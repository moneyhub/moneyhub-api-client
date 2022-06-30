import {SearchParams} from "../request"

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

export interface CategorySearchParams extends SearchParams {
  type?: "personal" | "business" | "all"
}
