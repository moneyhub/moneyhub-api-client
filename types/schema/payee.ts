import {SearchParams} from "../request"

export interface Payee {
  id: string
  clientId: string
  sortCode: string
  accountNumber: string
  createdAt: string
  modifiedAt: string
  active: boolean
  name: string
  externalId?: string
  userId?: string
}

export interface PayeesSearchParams extends SearchParams {
  userId?: string
  hasUserId?: boolean
}
