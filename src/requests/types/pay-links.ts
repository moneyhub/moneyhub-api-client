import {ApiResponse, ExtraOptions} from "../../request"
import {RequestPayee} from "../../schema/payee"
import {PayLink, PayLinkSearchParams} from "../../schema/pay-link"

interface PayLinkPost {
  widgetId: string
  reference: string
  amount: number
  endToEndId?: string
  useOnce?: boolean
  expiresAt?: string
}

interface PayLinkPostWithPayeeId extends PayLinkPost {
  payeeId: string
  payee?: never
 }

interface PayLinkPostWithPayee extends PayLinkPost {
  payee: RequestPayee
  payeeId?: never
}

type PayLinkPostBody = PayLinkPostWithPayeeId | PayLinkPostWithPayee

export type AddPayLink = (
  body: PayLinkPostBody,
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
