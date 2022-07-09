import type {ApiResponse, RequestsParams, SearchParams} from "src/request"
import type {Affordability, AffordabilityMetadata} from "../../types/schema/affordability"

export default ({config, request}: RequestsParams) => {
  const {resourceServerUrl} = config

  return {
    createAffordability: async ({userId}: {userId: string}) =>
      request<ApiResponse<Affordability>>(
        `${resourceServerUrl}/affordability`,
        {
          cc: {
            scope: "affordability:read affordability:create",
            sub: userId,
          },
          method: "POST",
        },
      ),

    getAffordability: async ({userId, id}: {userId: string, id: string}) =>
      request<ApiResponse<Affordability>>(
        `${resourceServerUrl}/affordability/${id}`,
        {
          cc: {
            scope: "affordability:read",
            sub: userId,
          },
          method: "GET",
        },
      ),

    getAllAffordability: async ({userId, ...query}: {
      userId: string
    } & SearchParams) =>
      request<ApiResponse<AffordabilityMetadata[]>>(
        `${resourceServerUrl}/affordability`,
        {
          cc: {
            scope: "affordability:read",
            sub: userId,
          },
          method: "GET",
          searchParams: query,
        },
      ),
  }
}
