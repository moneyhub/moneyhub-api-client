import {ApiResponse, SearchParams} from "../request"
import {Category, CategoryGroup, CategoryPost} from "../schema/category"

export interface CategoriesRequests {
  getCategories: ({
    userId,
    params,
  }: {
    userId: string
    params?: SearchParams
  }) => Promise<ApiResponse<Category[]>>

  getStandardCategories: ({
    params,
  }: {
    params?: SearchParams
  }) => Promise<ApiResponse<Category[]>>

  getCategory: ({
    userId,
    categoryId,
    params,
  }: {
    userId: string
    categoryId: string
    params?: SearchParams
  }) => Promise<ApiResponse<Category>>

  getCategoryGroups: ({
    userId,
    params,
  }: {
    userId: string
    params?: SearchParams
  }) => Promise<ApiResponse<CategoryGroup[]>>

  getStandardCategoryGroups: ({
    params,
  }: {
    params?: SearchParams
  }) => Promise<ApiResponse<CategoryGroup[]>>

  createCustomCategory: ({
    userId,
    category,
  }: {
    userId: string
    category: CategoryPost
  }) => Promise<ApiResponse<Category>>
}
