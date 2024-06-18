import {SearchParams} from "../request"

export interface PayLinkSearchParams extends SearchParams {
  widgetId?: string
  payeeId?: string
  isActive?: boolean
}

export interface PayLink {
  id: string
  clientId: string
  widgetId: string
  payeeId: string
  reference: string
  amount: number
  useOnce: boolean
  createdAt: string
  updatedAt: string
  archivedAt: string | null
  usedAt: string | null
  endToEndId: string | null
  expiresAt: string | null
}
