import {ApiResponse, SearchParams} from "../../request"
import {Category, CategoryGroup, CategoryPost, CategoryType} from "../../schema/category"

export interface CategoriesRequests {
  getCategories: ({
    userId,
    params,
  }: {
    userId: string
    params?: SearchParams & {type?: CategoryType}
  }) => Promise<ApiResponse<Category[]>>

  getStandardCategories: ({
    params,
  }: {
    params?: SearchParams & {type?: CategoryType}
  }) => Promise<ApiResponse<Category[]>>

  getCategory: ({
    userId,
    categoryId,
    params,
  }: {
    userId: string
    categoryId: string
    params?: {type?: CategoryType}
  }) => Promise<ApiResponse<Category>>

  getCategoryGroups: ({
    userId,
    params,
  }: {
    userId: string
    params?: {type?: CategoryType}
  }) => Promise<ApiResponse<CategoryGroup[]>>

  getStandardCategoryGroups: ({
    params,
  }: {
    params?: {type?: CategoryType}
  }) => Promise<ApiResponse<CategoryGroup[]>>

  createCustomCategory: ({
    userId,
    category,
  }: {
    userId: string
    category: CategoryPost
  }) => Promise<ApiResponse<Category>>
}
