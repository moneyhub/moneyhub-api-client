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
