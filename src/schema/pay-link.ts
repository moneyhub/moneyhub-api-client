import {SearchParams} from "../request"

export interface PayLinkSearchParams extends SearchParams {
  widgetId?: string
  payeeId?: string
}

export interface PayLink {
  id: string
  clientId: string
  payeeId: string
  reference: string
  widgetId: string
  amount?: number
  expiry?: string
  endToEndId?: string
  createdAt: string
  updatedAt: string
}
