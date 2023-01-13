import type {ApiResponse, SearchParams} from "../../request"
import type {Account, AccountWithDetails, AccountPost, AccountBalancePost, AccountPatch} from "../../schema/account"
import type {Balance} from "../../schema/balance"
import type {Counterparty} from "../../schema/counterparty"
import type {HoldingWithMatches, HoldingWithMatchesAndHistory, HoldingsValuation} from "../../schema/holding"
import type {RecurringTransactionEstimate} from "../../schema/transaction"
import type {StandingOrder, StandingOrderWithDetail} from "../../schema/standing-order"

export interface AccountsRequests {
  getAccounts: ({userId}: { userId: string, params?: SearchParams }) => Promise<ApiResponse<Account[]>>
  getAccountsWithDetails: ({
    userId,
  }: {
    userId: string
    params?: SearchParams
  }) => Promise<ApiResponse<AccountWithDetails[]>>
  getAccountsList: ({userId}: { userId: string, params?: SearchParams }) => Promise<ApiResponse<Account[]>>
  getAccountsListWithDetails: ({
    userId,
  }: {
    userId: string
    params?: SearchParams
  }) => Promise<ApiResponse<AccountWithDetails[]>>
  getAccount: ({userId, accountId}: { userId: string, accountId: string }) => Promise<ApiResponse<Account>>
  getAccountBalances: ({
    userId,
    accountId,
  }: {
    userId: string
    accountId: string
  }) => Promise<ApiResponse<Balance[]>>
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
    params?: SearchParams
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
  createAccount: ({userId, account}: { userId: string, account: AccountPost }) => Promise<ApiResponse<Account>>
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
  addAccountBalance: ({userId, accountId, balance}: {userId: string, accountId: string, balance: AccountBalancePost}) => Promise<ApiResponse<AccountBalancePost>>
  updateAccount: ({userId, accountId, account}: {userId: string, accountId: string, account: AccountPatch}) => Promise<ApiResponse<AccountWithDetails>>
}
