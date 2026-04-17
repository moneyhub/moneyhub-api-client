import {ApiResponse, ExtraOptions} from "../../../request"

export type CaasIncludeFieldTiers =
  | "basic"
  | "search_pro"
  | "search_enterprise"
  | "search_enterprise_plus"

export interface CaasLocalizedText {
  text?: string
  languageCode?: string
}

export interface CaasLatLng {
  latitude?: number
  longitude?: number
}

export interface CaasViewport {
  low?: CaasLatLng
  high?: CaasLatLng
}

export interface CaasPlusCode {
  globalCode?: string
  compoundCode?: string
}

export interface CaasAddressComponent {
  longText?: string
  shortText?: string
  types?: string[]
  languageCode?: string
}

export interface CaasEnhancedLocationData {
  formattedAddress?: string
  shortFormattedAddress?: string
  adrFormatAddress?: string
  addressComponents?: CaasAddressComponent[]
  location?: CaasLatLng
  viewport?: CaasViewport
  plusCode?: CaasPlusCode
  types?: string[]
  displayName?: CaasLocalizedText
  businessStatus?: string
  primaryType?: string
  googleMapsUri?: string
  utcOffsetMinutes?: number
  rating?: number
  priceLevel?: string
  websiteUri?: string
  nationalPhoneNumber?: string
  internationalPhoneNumber?: string
  reviews?: unknown[]
  [key: string]: unknown
}

export interface CaasEnhancedTransaction {
  transactionId: string
  userId: string
  accountId: string
  enhancedLocationData?: CaasEnhancedLocationData
}

export interface CaasEnhancedTransactionsRequests {
  caasGetEnhancedTransaction: (
    {
      accountId,
      transactionId,
      includeFieldTiers,
    }: {
      accountId: string
      transactionId: string
      includeFieldTiers?: CaasIncludeFieldTiers
    },
    options?: ExtraOptions,
  ) => Promise<ApiResponse<CaasEnhancedTransaction>>
}
