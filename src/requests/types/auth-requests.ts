import type {AccountType} from "../../schema/account"
import type {AuthRequestPostPayment, AuthRequestPostRecurringPayment, AuthRequestPostReversePayment} from "../../schema/payment"
import type {AuthRequestStandingOrderPost} from "../../schema/standing-order"
import type {AuthParams, AuthRequest} from "../../schema/auth-request"
import type {ApiResponse, ExtraOptions, SearchParams} from "../../request"

type AuthRequestPermissions =
  | "ReadStandingOrdersBasic"
  | "ReadStandingOrdersDetail"
  | "ReadBeneficiariesDetail"
  | "ReadAccountsDetail"
  | "ReadAccountsBasic"
  | "ReadTransactionsCredits"
  | "ReadTransactionsDebits"
  | "ReadTransactionsDetail"
  | "ReadProducts"
  | "ReadBalances"
  | "ReadParty"

export type PermissionsAction = "add" | "replace"

type CreateAuthRequestParams = {
  redirectUri?: string
  userId?: string
  scope: string
  connectionId?: string
  payment?: AuthRequestPostPayment
  standingOrder?: AuthRequestStandingOrderPost
  recurringPayment?: AuthRequestPostRecurringPayment
  reversePayment?: AuthRequestPostReversePayment
  categorisationType?: AccountType
  benefitsCheck?: boolean
  counterpartiesCheck?: string[]
  permissions?: AuthRequestPermissions
  permissionsAction?: PermissionsAction
  expirationDateTime?: string
  transactionsFromDateTime?: string
  sync?: {
    enableAsync?: boolean
  }
  accountVerification?: {
    accVerification?: boolean
  }
  customerIpAddress?: string
  customerLastLoggedTime?: string
  accountTypes?: string[]
  accountIdentification?: string[]
  env?: string
}

export interface AuthRequestsRequests {
  createAuthRequest: ({
    redirectUri,
    userId,
    scope,
    connectionId,
    payment,
    standingOrder,
    recurringPayment,
    reversePayment,
    categorisationType,
    benefitsCheck,
    counterpartiesCheck,
    permissions,
    permissionsAction,
    expirationDateTime,
    transactionsFromDateTime,
    sync,
    accountVerification,
    customerIpAddress,
    customerLastLoggedTime,
    accountTypes,
    accountIdentification,
    env,
  }: CreateAuthRequestParams, options?: ExtraOptions) => Promise<ApiResponse<AuthRequest>>

  completeAuthRequest: ({
    id,
    authParams,
  }: {
    id: string
    authParams: AuthParams
  }, options?: ExtraOptions) => Promise<ApiResponse<AuthRequest>>

  getAllAuthRequests: (params?: SearchParams, options?: ExtraOptions) => Promise<ApiResponse<AuthRequest[]>>

  getAuthRequest: ({id}: {id: string}, options?: ExtraOptions) => Promise<ApiResponse<AuthRequest>>
}
