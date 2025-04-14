import {RequestsParams} from "../request"
import {CreateResellerCheckRequest, ResellerCheckRequests} from "./types/reseller-check"

export default ({config, request}: RequestsParams): ResellerCheckRequests => {
  const {identityServiceUrl} = config

  const createResellerCheckRequest: CreateResellerCheckRequest = ({
    companyRegistrationNumber,
    email,
    telephone,
  }, options) =>
    request(`${identityServiceUrl}/reseller-check`, {
      method: "POST",
      cc: {
        scope: "reseller:create",
      },
      body: {
        companyRegistrationNumber,
        email,
        telephone,
      },
      options,
    })

  return {
    createResellerCheckRequest,
  }
}
