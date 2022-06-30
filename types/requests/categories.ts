import {ApiResponse} from "../request"
import {Category, CategoryGroup, CategoryPost, CategorySearchParams} from "../schema/category"

export interface CategoriesRequests {
  getCategories: ({
    userId,
    params,
  }: {
    userId: string
    params?: CategorySearchParams
  }) => Promise<ApiResponse<Category[]>>

  getStandardCategories: ({
    params,
  }: {
    params?: CategorySearchParams
  }) => Promise<ApiResponse<Category[]>>

  getCategory: ({
    userId,
    categoryId,
    params,
  }: {
    userId: string
    categoryId: string
    params?: Pick<CategorySearchParams, "type">
  }) => Promise<ApiResponse<Category>>

  getCategoryGroups: ({
    userId,
    params,
  }: {
    userId: string
    params?: Pick<CategorySearchParams, "type">
  }) => Promise<ApiResponse<CategoryGroup[]>>

  getStandardCategoryGroups: ({
    params,
  }: {
    params?: Pick<CategorySearchParams, "type">
  }) => Promise<ApiResponse<CategoryGroup[]>>

  createCustomCategory: ({
    userId,
    category,
  }: {
    userId: string
    category: CategoryPost
  }) => Promise<ApiResponse<Category>>
}
