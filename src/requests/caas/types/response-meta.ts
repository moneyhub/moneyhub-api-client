export interface CaasResponseMeta {
  correlationId: string
  count?: number
}

export interface CaasTransactionsEnrichResponseMeta extends CaasResponseMeta {
  errorTransactionIds?: string[]
}
