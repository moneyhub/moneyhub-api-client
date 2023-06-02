import type {ApiResponse, ExtraOptions, RequestsParams, SearchParams} from "../request"
import type {Affordability, AffordabilityMetadata} from "../schema/affordability"

export default ({config, request}: RequestsParams) => {
  const {resourceServerUrl} = config

  return {
    createAffordability: async ({userId}: {userId: string}, options?: ExtraOptions) =>
      request<ApiResponse<Affordability>>(
        `${resourceServerUrl}/affordability`,
        {
          cc: {
            scope: "affordability:read affordability:write",
            sub: userId,
          },
          method: "POST",
          options,
        },
      ),

    getAffordability: async ({userId, id}: {userId: string, id: string}, options?: ExtraOptions) =>
      request<ApiResponse<Affordability>>(
        `${resourceServerUrl}/affordability/${id}`,
        {
          cc: {
            scope: "affordability:read",
            sub: userId,
          },
          method: "GET",
          options,
        },
      ),

    getAllAffordability: async ({userId, ...query}: {
      userId: string
    } & SearchParams, options?: ExtraOptions) =>
      request<ApiResponse<AffordabilityMetadata[]>>(
        `${resourceServerUrl}/affordability`,
        {
          cc: {
            scope: "affordability:read",
            sub: userId,
          },
          method: "GET",
          searchParams: query,
          options,
        },
      ),
  }
}
