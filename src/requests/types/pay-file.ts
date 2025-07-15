import {ApiResponse, ExtraOptions} from "../../request"
import {PayFile} from "../../schema/pay-file"

export interface PayFileRequests {
  uploadPayFile: ({
    file,
    transactionCount,
    controlSum,
    providerId,
  }: {
    file: File
    transactionCount: string
    controlSum: string
    providerId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<PayFile>>

}
