import type {AccountsRequests} from "./requests/accounts"
import type {AuthRequestsRequests} from "./requests/auth-requests"
import type {BeneficiariesRequests} from "./requests/beneficiaries"
import type {CategoriesRequests} from "./requests/categories"
import type {PayeesRequests} from "./requests/payees"
import type {PaymentsRequests} from "./requests/payments"
import type {ProjectsRequests} from "./requests/projects"
import type {RecurringPaymentsRequests} from "./requests/recurring-payments"
import type {RegularTransactionsRequests} from "./requests/regular-transactions"
import type {RentalRecordsRequests} from "./requests/rental-records"
import type {SavingsGoalsRequests} from "./requests/savings-goals"
import type {SpendingAnalysisRequests} from "./requests/spending-analysis"
import type {SpendingGoalsRequests} from "./requests/spending-goals"
import type {StandingOrdersRequests} from "./requests/standing-orders"
import type {SyncRequests} from "./requests/sync"
import type {TaxRequests} from "./requests/tax"
import type {TransactionFilesRequests} from "./requests/transaction-files"
import type {TransactionSplitsRequests} from "./requests/transaction-splits"
import type {TransactionsRequests} from "./requests/transactions"
import type {UnauthenticatedRequests} from "./requests/unauthenticated"
import type {UsersAndConnectionsRequests} from "./requests/users-and-connections"
import type {TokensRequests} from "./tokens"
import type {GetAuthUrlsMethods} from "./get-auth-urls"
import type {JSONWebKeySet} from "jose"

export interface MoneyhubRequests extends
  AccountsRequests,
  AuthRequestsRequests,
  BeneficiariesRequests,
  CategoriesRequests,
  PayeesRequests,
  PaymentsRequests,
  ProjectsRequests,
  RecurringPaymentsRequests,
  RegularTransactionsRequests,
  RentalRecordsRequests,
  SavingsGoalsRequests,
  SpendingAnalysisRequests,
  SpendingGoalsRequests,
  StandingOrdersRequests,
  SyncRequests,
  TaxRequests,
  TransactionFilesRequests,
  TransactionSplitsRequests,
  TransactionsRequests,
  UnauthenticatedRequests,
  UsersAndConnectionsRequests
  {}

export interface MoneyHubInstance extends
  MoneyhubRequests, TokensRequests, GetAuthUrlsMethods {
  keys: () => JSONWebKeySet | null
}
