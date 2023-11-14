import {ApiResponse, ExtraOptions} from "../../request"
import {RequestPayee} from "../../schema/payee"
import {PayLink, PayLinkSearchParams} from "../../schema/pay-link"

export type AddPayLink = (
  body: {
    widgetId: string
    payeeId?: string
    amount?: number
    payee?: RequestPayee
    reference: string
    expiry?: string
    endToEndId?: string
    userId?: string
  },
  options?: ExtraOptions,
) => Promise<ApiResponse<PayLink>>

export type GetPayLink = (
  {id}: {id: string},
  options?: ExtraOptions,
) => Promise<ApiResponse<PayLink>>

export type GetPayLinks = (
  params?: PayLinkSearchParams,
  options?: ExtraOptions,
) => Promise<ApiResponse<PayLink[]>>

export interface PayLinksRequests {
  addPayLink: AddPayLink
  getPayLink: GetPayLink
  getPayLinks: GetPayLinks
}
