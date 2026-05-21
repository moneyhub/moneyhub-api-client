import type {ApiResponse, ExtraOptions, RequestsParams} from "../request"

const LLM_GATEWAY_SAVINGS_GOALS_WRITE_SCOPE = "llm_gateway_savings_goals:write"

export default ({config, request}: RequestsParams) => {
  const {resourceServerUrl} = config

  return {
    postLlmGatewaySavingsGoals: async (
      {userId, body = {}}: {userId: string, body?: Record<string, unknown>},
      options?: ExtraOptions,
    ) =>
      request<ApiResponse<Record<string, unknown>>>(
        `${resourceServerUrl}/llm-gateway/savings-goals`,
        {
          method: "POST",
          body,
          cc: options?.token
            ? undefined
            : {
              scope: LLM_GATEWAY_SAVINGS_GOALS_WRITE_SCOPE,
              sub: userId,
            },
          options: {
            version: "v3",
            ...options,
          },
        },
      ),
  }
}
