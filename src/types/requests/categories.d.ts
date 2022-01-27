import type { RequestsParams } from '..';
import type { RequestOptions } from '../request';

export type CategoriesRequestsParams = RequestsParams;

export default function CategoriesRequests({
  config,
  request,
}: CategoriesRequestsParams): CategoriesRequests;

interface CategoriesRequests {
  getCategories: ({
    userId,
    params = {},
  }: {
    userId: string;
    params?: RequestOptions['searchParams'];
  }) => Promise<unknown>;
  getStandardCategories: ({
    params = {},
  }: {
    params: RequestOptions['searchParams'];
  }) => Promise<unknown>;
  getCategory: ({
    userId,
    categoryId,
    params = {},
  }: {
    userId: string;
    categoryId: string;
    params?: RequestOptions['searchParams'];
  }) => Promise<unknown>;
  getCategoryGroups: ({
    userId,
    params = {},
  }: {
    userId: string;
    params?: RequestOptions['searchParams'];
  }) => Promise<unknown>;
  getStandardCategoryGroups: ({
    params = {},
  }: {
    params: RequestOptions['searchParams'];
  }) => Promise<unknown>;
  createCustomCategory: ({
    userId,
    category: { group, name },
  }: {
    userId: string;
    category: { group: string; name: string };
  }) => Promise<unknown>;
}
