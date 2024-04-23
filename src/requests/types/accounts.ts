import type {ApiResponse, ExtraOptions, SearchParams} from "../../request"
import type {Account, AccountWithDetails, AccountPost, AccountBalancePost, AccountPatch} from "../../schema/account"
import type {Balance} from "../../schema/balance"
import type {Counterparty} from "../../schema/counterparty"
import type {HoldingWithMatches, HoldingWithMatchesAndHistory, HoldingsValuation} from "../../schema/holding"
import type {RecurringTransactionEstimate} from "../../schema/transaction"
import type {StandingOrder, StandingOrderWithDetail} from "../../schema/standing-order"
import type {Statement} from "../../schema/statement"

export interface AccountsRequests {
  getAccounts: ({userId, params}: { userId?: string, params?: SearchParams }, options?: ExtraOptions) => Promise<ApiResponse<Account[]>>
  getAccountsWithDetails: ({
    userId,
  }: {
    userId?: string
    params?: SearchParams
  }, options?: ExtraOptions) => Promise<ApiResponse<AccountWithDetails[]>>
  getAccountsList: ({userId, params}: { userId?: string, params?: SearchParams }, options?: ExtraOptions) => Promise<ApiResponse<Account[]>>
  getAccountsListWithDetails: ({
    userId,
  }: {
    userId?: string
    params?: SearchParams
  }, options?: ExtraOptions) => Promise<ApiResponse<AccountWithDetails[]>>
  getAccount: ({userId, accountId}: { userId?: string, accountId: string }, options?: ExtraOptions) => Promise<ApiResponse<Account>>
  getAccountBalances: ({
    userId,
    accountId,
  }: {
    userId?: string
    accountId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<Balance[]>>
  getAccountWithDetails: ({
    userId,
    accountId,
  }: {
    userId?: string
    accountId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<AccountWithDetails>>
  getAccountHoldings: ({
    userId,
    accountId,
  }: {
    userId?: string
    accountId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<HoldingsValuation[]>>
  getAccountHoldingsWithMatches: ({
    userId,
    accountId,
  }: {
    userId?: string
    accountId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<HoldingWithMatches[]>>
  getAccountCounterparties: ({
    userId,
    accountId,
  }: {
    userId?: string
    accountId: string
    params?: SearchParams
  }, options?: ExtraOptions) => Promise<ApiResponse<Counterparty[]>>
  getAccountRecurringTransactions: ({
    userId,
    accountId,
  }: {
    userId?: string
    accountId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<RecurringTransactionEstimate[]>>
  getAccountStandingOrders: ({
    userId,
    accountId,
  }: {
    userId?: string
    accountId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<StandingOrder[]>>
  getAccountStandingOrdersWithDetail: ({
    userId,
    accountId,
  }: {
    userId?: string
    accountId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<StandingOrderWithDetail[]>>
  getAccountStatements: ({
    userId,
    accountId,
  }: {
    userId?: string
    accountId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<Statement[]>>
  getAccountStatementsWithDetail: ({
    userId,
    accountId,
  }: {
    userId?: string
    accountId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<Statement[]>>
  getAccountHolding: ({
    userId,
    accountId,
    holdingId,
  }: {
    userId?: string
    accountId: string
    holdingId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<HoldingWithMatchesAndHistory>>
  createAccount: ({userId, account}: { userId: string, account: AccountPost }, options?: ExtraOptions) => Promise<ApiResponse<Account>>
  deleteAccount: ({userId, accountId}: { userId: string, accountId: string }, options?: ExtraOptions) => Promise<number>
  updateAccount: ({userId, accountId, account}: {userId: string, accountId: string, account: AccountPatch}, options?: ExtraOptions) => Promise<ApiResponse<AccountWithDetails>>
  addAccountBalance: ({userId, accountId, balance}: {userId: string, accountId: string, balance: AccountBalancePost}, options?: ExtraOptions) => Promise<ApiResponse<AccountBalancePost>>
}
