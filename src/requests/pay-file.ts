import {RequestsParams} from "../request"
import {PayFileRequests} from "./types/pay-file"

export default ({config, request}: RequestsParams): PayFileRequests => {
  const {identityServiceUrl} = config

  return {
    uploadPayFile: async ({file, transactionCount, controlSum, providerId}, options) =>{
      const formData = new FormData()
      formData.append("file", file)
      formData.append("transactionCount", transactionCount)
      formData.append("controlSum", controlSum)
      formData.append("providerId", providerId)
      return request(`${identityServiceUrl}/pay-file/upload-file`, {
        method: "POST",
        formData,
        cc: {
          scope: "pay_file:write",
        },
        options,
      })
    },
  }
}
