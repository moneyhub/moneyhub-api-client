import type {AccountType} from "../schema/account"
import type {AuthRequestPostPayment, AuthRequestPostRecurringPayment, AuthRequestPostReversePayment} from "../schema/payment"
import type {AuthRequestStandingOrderPost} from "../schema/standing-order"
import type {AuthParams, AuthRequest} from "../schema/auth-request"
import type {ApiResponse, SearchParams} from "src/request"

type AuthRequestPermissions =
  | "ReadStandingOrdersBasic"
  | "ReadStandingOrdersDetail"
  | "ReadBeneficiariesDetail"

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
  expirationDateTime?: string
  transactionsFromDateTime?: string
  sync?: {
    enableAsync?: boolean
  }
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
    expirationDateTime,
    transactionsFromDateTime,
    sync,
  }: CreateAuthRequestParams) => Promise<ApiResponse<AuthRequest>>

  completeAuthRequest: ({
    id,
    authParams,
  }: {
    id: string
    authParams: AuthParams
  }) => Promise<ApiResponse<AuthRequest>>

  getAllAuthRequests: (params?: SearchParams) => Promise<ApiResponse<AuthRequest[]>>

  getAuthRequest: ({id}: {id: string}) => Promise<ApiResponse<AuthRequest>>
}
