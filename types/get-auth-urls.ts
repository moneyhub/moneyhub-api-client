export interface GetAuthUrlsMethods {
  getAuthorizeUrl: ({
    state,
    scope,
    nonce,
    claims,
    permissions,
    enableAsync,
    expirationDateTime,
    transactionFromDateTime,
  }: {
    state: string
    scope: string
    nonce: string
    claims: object
    permissions: string[]
    enableAsync: boolean
    expirationDateTime: string
    transactionFromDateTime: string
  }) => Promise<string>
  getAuthorizeUrlFromRequestUri: ({
    requestUri,
  }: {
    requestUri: string
  }) => string
  requestObject: ({
    scope,
    state,
    claims,
    nonce,
  }: {
    scope: string
    state: string
    claims: object
    nonce: string
    }) => Promise<string>
  getRequestUri: (requestObject: any) => Promise<string>
  getAuthorizeUrlForCreatedUser: ({
    bankId,
    state,
    nonce,
    userId,
    claims,
    permissions,
    expirationDateTime,
    transactionFromDateTime,
    enableAsync,
  }:
    {
      bankId: string
      state: string
      nonce: string
      userId: string
      claims: object
      permissions: string[]
      expirationDateTime: string
      transactionFromDateTime: string
      enableAsync: boolean
    }) => Promise<string>
  getReauthAuthorizeUrlForCreatedUser: ({
    userId,
    connectionId,
    state,
    nonce,
    claims,
    expirationDateTime,
    transactionFromDateTime,
    enableAsync,
  }: {
    userId: string
    connectionId: string
    state: string
    nonce: string
    claims: object
    expirationDateTime: string
    transactionFromDateTime: string
    enableAsync: boolean
  }) => Promise<string>
  getRefreshAuthorizeUrlForCreatedUser: ({
    userId,
    connectionId,
    state,
    nonce,
    claims,
    expirationDateTime,
    transactionFromDateTime,
    enableAsync,
  }: {
    userId: string
    connectionId: string
    state: string
    nonce: string
    claims: object
    expirationDateTime: string
    transactionFromDateTime: string
    enableAsync: boolean
  }) => Promise<string>
  getPaymentAuthorizeUrl: ({
    bankId,
    payeeId,
    payeeType,
    amount,
    payeeRef,
    payerRef,
    payerId,
    payerType,
    state,
    nonce,
    context,
    readRefundAccount,
    userId,
    claims,
  }: {
    bankId: string
    payeeId: string
    payeeType: string
    amount: number
    payeeRef: string
    payerRef: string
    payerId: string
    payerType: string
    state: string
    nonce: string
    context: string
    readRefundAccount: boolean
    userId: string
    claims: boolean
  }) => Promise<string>
  getReversePaymentAuthorizeUrl: ({
    bankId,
    paymentId,
    state,
    nonce,
    amount,
    claims,
  }: {
    bankId: string
    paymentId: string
    state: string
    nonce: string
    amount: number
    claims: object
  }) => Promise<string>
  getRecurringPaymentAuthorizeUrl: ({
    bankId,
    payeeId,
    payeeType,
    payerId,
    payerType,
    reference,
    validFromDate,
    validToDate,
    maximumIndividualAmount,
    currency,
    periodicLimits,
    type,
    context,
    state,
    nonce,
    userId,
    claims,
  }: {
    bankId: string
    payeeId: string
    payeeType: string
    payerId: string
    payerType: string
    reference: string
    validFromDate: string
    validToDate: string
    maximumIndividualAmount: number
    currency: string
    periodicLimits: any
    type: string
    context: string
    state: string
    nonce: string
    userId: string
    claims: object
  }) => Promise<string>
  getStandingOrderAuthorizeUrl: ({
    bankId,
    payeeId,
    payeeType,
    payerId,
    payerType,
    reference,
    frequency,
    numberOfPayments,
    firstPaymentAmount,
    recurringPaymentAmount,
    finalPaymentAmount,
    currency,
    firstPaymentDate,
    recurringPaymentDate,
    finalPaymentDate,
    state,
    nonce,
    context,
    claims,
  }: {
    bankId: string
    payeeId: string
    payeeType: string
    payerId: string
    payerType: string
    reference: string
    frequency: string
    numberOfPayments: number
    firstPaymentAmount: number
    recurringPaymentAmount: number
    finalPaymentAmount: number
    currency: string
    firstPaymentDate: string
    recurringPaymentDate: string
    finalPaymentDate: string
    state: string
    nonce: string
    context: string
    claims: object
  }) => Promise<string>
}
