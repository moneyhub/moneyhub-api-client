import {Amount} from "./amount"

export enum StatementType {
  AccountClosure = "AccountClosure",
  AccountOpening = "AccountOpening",
  Annual = "Annual",
  Interim = "Interim",
  RegularPeriodic = "RegularPeriodic"
}

export type StatementBenefit = {
  type: string
  amount: Amount
}

export enum StatementFeeFrequency {
  ChargingPeriod = "ChargingPeriod",
  PerTransactionAmount = "PerTransactionAmount",
  PerTransactionPercentage = "PerTransactionPercentage",
  Quarterly = "Quarterly",
  StatementMonthly = "StatementMonthly",
  Weekly = "Weekly"
}

export type StatementFee = {
  description: string
  creditDebitIndicator: string
  type: string
  rate?: string
  rateType?: string
  frequency?: StatementFeeFrequency
  amount: Amount
}

export enum StatementInterestRateType {
  BOEBaseRate = "BOEBaseRate",
  FixedRate = "FixedRate",
  Gross = "Gross",
  LoanProviderBaseRate = "LoanProviderBaseRate",
  Net = "Net"
}

export enum StatementInterestFrequency {
  Daily = "Daily",
  HalfYearly = "HalfYearly",
  Monthly = "Monthly",
  PerStatementDate = "PerStatementDate",
  Quarterly = "Quarterly",
  Weekly = "Weekly",
  Yearly = "Yearly"
}

export type StatementInterest = {
  description: string
  creditDebitIndicator: string
  type: string
  rate?: string
  rateType?: StatementInterestRateType
  frequency?: StatementInterestFrequency
  amount: Amount
}

export type StatementAmount = {
  creditDebitIndicator: string
  type: string
  amount: Amount
  amountSubType?: string
  localAmount?: Amount
  localAmountSubType?: string
}

export type StatementDate = {
  date: string
  type: string
}

export type StatementRate = {
  rate: string
  type: string
}

export type StatementValue = {
  value: string
  type: string
}

export type Statement = {
  uid: string
  accountId?: string
  userId?: string
  providerStatementId?: string
  providerAccountId: string
  reference: string
  type: StatementType
  startDate: string
  endDate: string
  creationDate: string
  description: string
  benefits: StatementBenefit[]
  fees: StatementFee[]
  interest: StatementInterest[]
  amounts: StatementAmount[]
  dates: StatementDate[]
  rates: StatementRate[]
  values: StatementValue[]
  totalValue: Amount
  currency: string
}
