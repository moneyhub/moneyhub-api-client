type PortfolioType = "LISA" | "ISA" | "SIPP" | "GIA"

interface Valuation {
  dateUpdated: string
  amount: number
  currency: string
}

interface Quantity {
  dateUpdate: string
  settledQuantity: number
}

interface Product {
  name: string
  type: "ISIN" | "SEDOL" | "Citi Code" | "CUSIP" | "Fund Code" | "Ticker Code"
  id: string
  secondaryType: string
  secondaryId: string
}

type TransactionType = "Redemption" | "Subscription" | "Subscription Savings Plan" | "Redemption Withdrawing Plan" | "Transfer In" | "Transfer Out" | "Switch In" | "Switch Out" | "Subscription Asset Allocation" | "Redemption Asset Allocation"

type CorporateActionType = "Dividend Reinvestment" | "Capital Gains Distribution" | "Cash Dividend" | "Dividend Option Stock Dividend" | "Liquidation" | "Merger" | "Name Change" | "Spin Off" | "Stock Split" | "Reverse Stock Split" | "Tender" | "Bonus Issue" | "Rights Distribution" | "Call On Rights" | "Change Redenomination" | "Exchange Option" | "Exchange Offer" | "Decrease In Value"

interface TransactionCost {
  costType: string
  amount: number
  currency: string
}

interface Transactions {
  id: string
  tradeDate: string
  settlementDate: string
  orderDate: string
  quantity: number
  tradingCurrency: string
  executionPrice: number
  exchangeRate: number
  grossAmount: number
  transactionType: TransactionType
  corporateActionType: CorporateActionType
  bookingText: string
  transactionCosts: TransactionCost[]
}

export interface OsipAccount {
  id: string
  name: string
  portfolioType: PortfolioType
  portfolioId: string
  valuation: Valuation
}

export interface OsipHolding {
  id: string
  date: string
  quantity: Quantity
  product: Product
  price: Valuation
  valuatuion: Valuation
}

export interface OsipTransaction {
  id: string
  date: string
  quantity: Quantity
  product: Product
  price: Valuation
  valuation: Valuation
  transactions: Transactions
}
