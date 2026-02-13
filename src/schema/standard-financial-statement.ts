/**
 * Standard Financial Statement (Money Advice Service schema).
 * GET /standard-financial-statements/{reportId} response data.
 */
export interface StandardFinancialStatement {
  id: string
  createdAt: string
  version: string
  currency: string

  /** Schema version key (e.g. "2.1") – structure defined by Money Advice Service */
  [key: string]: unknown
}

/**
 * Metadata item from GET /standard-financial-statements list.
 */
export interface StandardFinancialStatementsMetadata {
  id: string
  status?: string
  [key: string]: unknown
}
