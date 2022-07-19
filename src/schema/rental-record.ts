import type {Amount, AmountPost} from "./balance"

type Frequency =
  | "weekly"
  | "fortnightly"
  | "monthly"

export interface RentalRecord {
  id: string
  userId: string
  title?: string
  firstName: string
  lastName: string
  birthdate: string
  addressLine1: string
  addressLine2?: string
  addressLine3?: string
  addressLine4?: string
  postalCode: string
  tenancyStartDate: string
  rentalAmount: Amount
  rentalFrequency: Frequency
  seriesId: string
  createdAt: string
  modifiedAt: string
  lastSubmittedDat?: string
  consentApprovedAt?: string
}

export interface RentalRecordPost {
  title?: string
  firstName: string
  lastName: string
  birthdate: string
  addressLine1: string
  addressLine2?: string
  addressLine3?: string
  addressLine4?: string
  postalCode: string
  tenancyStartDate: string
  rentalAmount: AmountPost
  rentalFrequency: Frequency
  seriesId: string
}
