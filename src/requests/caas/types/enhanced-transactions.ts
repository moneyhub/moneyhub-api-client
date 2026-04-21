import {ApiResponse, ExtraOptions} from "../../../request"

type CaasIncludeFieldTiers =
  | "basic"
  | "search_pro"
  | "search_enterprise"
  | "search_enterprise_plus"

interface CaasLocalizedText {
  text?: string
  languageCode?: string
}

interface CaasLatLng {
  latitude?: number
  longitude?: number
}

interface CaasViewport {
  low?: CaasLatLng
  high?: CaasLatLng
}

interface CaasPlusCode {
  globalCode?: string
  compoundCode?: string
}

interface CaasAddressComponent {
  longText?: string
  shortText?: string
  types?: string[]
  languageCode?: string
}

interface CaasAddressDescriptorLandmark {
  name?: string
  placeId?: string
  displayName?: CaasLocalizedText
  types?: string[]
  spatialRelationship?: string
  straightLineDistanceMeters?: number
  travelDistanceMeters?: number
}

interface CaasAddressDescriptorArea {
  name?: string
  placeId?: string
  displayName?: CaasLocalizedText
  containment?: string
}

interface CaasAddressDescriptor {
  landmarks?: CaasAddressDescriptorLandmark[]
  areas?: CaasAddressDescriptorArea[]
}

interface CaasPostalAddress {
  revision?: number
  regionCode?: string
  languageCode?: string
  postalCode?: string
  sortingCode?: string
  administrativeArea?: string
  locality?: string
  sublocality?: string
  addressLines?: string[]
  recipients?: string[]
  organization?: string
}

interface CaasGoogleMapsLinks {
  directionsUri?: string
  placeUri?: string
  writeAReviewUri?: string
  reviewsUri?: string
  photosUri?: string
}

interface CaasTimeZone {
  id?: string
  version?: string
}

interface CaasAccessibilityOptions {
  wheelchairAccessibleParking?: boolean
  wheelchairAccessibleEntrance?: boolean
  wheelchairAccessibleRestroom?: boolean
  wheelchairAccessibleSeating?: boolean
}

interface CaasPlaceReference {
  name?: string
  id?: string
}

interface CaasMoney {
  currencyCode?: string
  units?: string
  nanos?: number
}

interface CaasPriceRange {
  startPrice?: CaasMoney
  endPrice?: CaasMoney
}

interface CaasOpeningHoursPoint {
  day?: number
  hour?: number
  minute?: number
}

interface CaasOpeningHoursPeriod {
  open?: CaasOpeningHoursPoint
  close?: CaasOpeningHoursPoint
}

interface CaasOpeningHours {
  openNow?: boolean
  secondaryHoursType?: string
  weekdayDescriptions?: string[]
  periods?: CaasOpeningHoursPeriod[]
  nextOpenTime?: string
}

interface CaasGenerativeSummary {
  overview?: CaasLocalizedText
  overviewFlagContentUri?: string
  description?: CaasLocalizedText
  descriptionFlagContentUri?: string
}

interface CaasReviewSummaryText {
  text?: string
  languageCode?: string
}

interface CaasReviewSummary {
  text?: CaasReviewSummaryText
  flagContentUri?: string
}

interface CaasNeighborhoodSummary {
  description?: CaasLocalizedText
  descriptionFlagContentUri?: string
}

interface CaasEvConnectorAggregation {
  type?: string
  maxChargeRateKw?: number
  count?: number
  availableCount?: number
  outOfServiceCount?: number
  availabilityLastUpdateTime?: string
}

interface CaasEvChargeOptions {
  connectorCount?: number
  connectorAggregation?: CaasEvConnectorAggregation[]
}

interface CaasEvChargeAmenitySummary {
  connectorCount?: number
  availableCount?: number
}

interface CaasFuelPrice {
  type?: string
  price?: CaasMoney
  updateTime?: string
}

interface CaasFuelOptions {
  fuelPrices?: CaasFuelPrice[]
}

interface CaasParkingOptions {
  freeParkingLot?: boolean
  paidParkingLot?: boolean
  freeStreetParking?: boolean
  paidStreetParking?: boolean
  valetParking?: boolean
  freeGarageParking?: boolean
  paidGarageParking?: boolean
}

interface CaasPaymentOptions {
  acceptsCreditCards?: boolean
  acceptsDebitCards?: boolean
  acceptsCashOnly?: boolean
  acceptsNfc?: boolean
}

interface CaasRoutingSummary {
  distanceMeters?: number
  duration?: string
}

interface CaasEnhancedLocationData {
  formattedAddress?: string
  shortFormattedAddress?: string
  adrFormatAddress?: string
  addressComponents?: CaasAddressComponent[]
  addressDescriptor?: CaasAddressDescriptor
  postalAddress?: CaasPostalAddress
  location?: CaasLatLng
  viewport?: CaasViewport
  plusCode?: CaasPlusCode
  types?: string[]
  businessStatus?: string
  displayName?: CaasLocalizedText
  primaryType?: string
  primaryTypeDisplayName?: CaasLocalizedText
  googleMapsUri?: string
  googleMapsLinks?: CaasGoogleMapsLinks
  iconBackgroundColor?: string
  iconMaskBaseUri?: string
  utcOffsetMinutes?: number
  timeZone?: CaasTimeZone
  accessibilityOptions?: CaasAccessibilityOptions
  containingPlaces?: CaasPlaceReference[]
  subDestinations?: CaasPlaceReference[]
  pureServiceAreaBusiness?: boolean
  rating?: number
  userRatingCount?: number
  priceLevel?: string
  priceRange?: CaasPriceRange
  websiteUri?: string
  internationalPhoneNumber?: string
  nationalPhoneNumber?: string
  regularOpeningHours?: CaasOpeningHours
  regularSecondaryOpeningHours?: CaasOpeningHours[]
  currentOpeningHours?: CaasOpeningHours
  currentSecondaryOpeningHours?: CaasOpeningHours[]
  editorialSummary?: CaasLocalizedText
  generativeSummary?: CaasGenerativeSummary
  reviewSummary?: CaasReviewSummary
  neighborhoodSummary?: CaasNeighborhoodSummary
  reviews?: unknown[]
  evChargeOptions?: CaasEvChargeOptions
  evChargeAmenitySummary?: CaasEvChargeAmenitySummary
  fuelOptions?: CaasFuelOptions
  parkingOptions?: CaasParkingOptions
  paymentOptions?: CaasPaymentOptions
  routingSummaries?: CaasRoutingSummary[]
  allowsDogs?: boolean
  curbsidePickup?: boolean
  delivery?: boolean
  dineIn?: boolean
  goodForChildren?: boolean
  goodForGroups?: boolean
  goodForWatchingSports?: boolean
  liveMusic?: boolean
  menuForChildren?: boolean
  outdoorSeating?: boolean
  reservable?: boolean
  restroom?: boolean
  servesBeer?: boolean
  servesBreakfast?: boolean
  servesBrunch?: boolean
  servesCocktails?: boolean
  servesCoffee?: boolean
  servesDessert?: boolean
  servesDinner?: boolean
  servesLunch?: boolean
  servesVegetarianFood?: boolean
  servesWine?: boolean
  takeout?: boolean
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
