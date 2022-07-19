import type {ApiResponse, SearchParams} from "src/request"
import type {Account, AccountWithDetails, AccountPost} from "src/schema/account"
import type {Balance} from "src/schema/balance"
import type {Counterparty} from "src/schema/counterparty"
import type {HoldingWithMatches, HoldingWithMatchesAndHistory, HoldingsValuation} from "src/schema/holding"
import type {RecurringTransactionEstimate} from "src/schema/transaction"
import type {StandingOrder, StandingOrderWithDetail} from "src/schema/standing-order"

export interface AccountsRequests {
  getAccounts: ({userId}: { userId: string, params?: SearchParams }) => Promise<ApiResponse<Account[]>>
  getAccountsWithDetails: ({
    userId,
  }: {
    userId: string
    params?: SearchParams
  }) => Promise<AccountWithDetails[]>
  getAccount: ({userId, accountId}: { userId: string, accountId: string }) => Promise<ApiResponse<Account>>
  getAccountBalances: ({
    userId,
    accountId,
  }: {
    userId: string
    accountId: string
  }) => Promise<Balance[]>
  getAccountWithDetails: ({
    userId,
    accountId,
  }: {
    userId: string
    accountId: string
  }) => Promise<ApiResponse<AccountWithDetails>>
  getAccountHoldings: ({
    userId,
    accountId,
  }: {
    userId: string
    accountId: string
  }) => Promise<ApiResponse<HoldingsValuation[]>>
  getAccountHoldingsWithMatches: ({
    userId,
    accountId,
  }: {
    userId: string
    accountId: string
  }) => Promise<ApiResponse<HoldingWithMatches[]>>
  getAccountCounterparties: ({
    userId,
    accountId,
  }: {
    userId: string
    accountId: string
  }) => Promise<ApiResponse<Counterparty[]>>
  getAccountRecurringTransactions: ({
    userId,
    accountId,
  }: {
    userId: string
    accountId: string
  }) => Promise<ApiResponse<RecurringTransactionEstimate[]>>
  getAccountStandingOrders: ({
    userId,
    accountId,
  }: {
    userId: string
    accountId: string
  }) => Promise<ApiResponse<StandingOrder[]>>
  createAccount: ({userId}: { userId: string, account: AccountPost }) => Promise<ApiResponse<Account>>
  deleteAccount: ({userId, accountId}: { userId: string, accountId: string }) => Promise<number>
  getAccountHolding: ({
    userId,
    accountId,
    holdingId,
  }: {
    userId: string
    accountId: string
    holdingId: string
  }) => Promise<ApiResponse<HoldingWithMatchesAndHistory>>
  getAccountStandingOrdersWithDetail: ({
    userId,
    accountId,
  }: {
    userId: string
    accountId: string
  }) => Promise<ApiResponse<StandingOrderWithDetail[]>>
}
