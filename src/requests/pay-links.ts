import {ApiResponse, ExtraOptions, RequestsParams} from "../request"
import {
  PayLinksRequests,
  AddPayLink,
  GetPayLink,
  GetPayLinks,
} from "./types/pay-links"
import {PayLink} from "../schema/pay-link"

export default ({config, request}: RequestsParams): PayLinksRequests => {
  const {identityServiceUrl} = config

  const addPayLink: AddPayLink = (
    body,
    options?: ExtraOptions,
  ): Promise<ApiResponse<PayLink>> =>
    request(`${identityServiceUrl}/pay-links`, {
      method: "POST",
      body,
      cc: {
        scope: "pay_link:create",
      },
      options,
    })
  const getPayLink: GetPayLink = (
    {id},
    options?: ExtraOptions,
  ): Promise<ApiResponse<PayLink>> =>
    request(`${identityServiceUrl}/pay-links/${id}`, {
      cc: {
        scope: "pay_link:read",
      },
      options,
    })

  const getPayLinks: GetPayLinks = (
    params = {},
    options,
  ): Promise<ApiResponse<PayLink[]>> =>
    request(`${identityServiceUrl}/pay-links`, {
      searchParams: params,
      cc: {
        scope: "pay_link:read",
      },
      options,
    })

  return {
    addPayLink,
    getPayLink,
    getPayLinks,
  }
}
