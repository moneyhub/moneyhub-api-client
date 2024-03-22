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
  | "ReadTransactionsBasic"
  | "ReadProducts"
  | "ReadBalances"
  | "ReadParty"

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
  permissionsAction?: "add" | "replace"
  expirationDateTime?: string
  transactionsFromDateTime?: string
  sync?: {
    enableAsync?: boolean
  }
  customerIpAddress?: string
  customerLastLoggedTime?: string
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
    customerIpAddress,
    customerLastLoggedTime,
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
