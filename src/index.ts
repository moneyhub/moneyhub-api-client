import {Issuer, custom, generators} from "openid-client"
import {JWKS} from "jose"
import getAuthUrlsFactory from "./get-auth-urls"
import getTokensFactory from "./tokens"
import requestsFactory from "./requests"
import * as R from "ramda"
import req from "./request"
import type {MoneyHubInstance} from "../types"
import type {ApiClientConfig} from "../types/config"
const DEFAULT_TIMEOUT = 60000

const Moneyhub = async (apiClientConfig: ApiClientConfig): Promise<MoneyHubInstance> => {
  const config = R.evolve(
    {
      identityServiceUrl: (val: ApiClientConfig["identityServiceUrl"]) => val.replace("/oidc", ""),
    },
    apiClientConfig,
  )

  const {
    identityServiceUrl,
    options = {},
    client: {
      client_id,
      client_secret,
      id_token_signed_response_alg,
      request_object_signing_alg,
      redirect_uri,
      keys,
      token_endpoint_auth_method,
    },
  } = config

  const {timeout = DEFAULT_TIMEOUT} = options

  custom.setHttpOptionsDefaults({
    timeout,
  })

  const moneyhubIssuer = await Issuer.discover(identityServiceUrl + "/oidc")

  const client = new moneyhubIssuer.Client(
    {
      client_id,
      client_secret,
      id_token_signed_response_alg,
      redirect_uri,
      token_endpoint_auth_method,
      request_object_signing_alg,
    },
    {keys},
  )

  client[custom.clock_tolerance] = 10

  const request = req({
    client,
    options: {timeout},
  })

  const moneyhub = {
    ...getAuthUrlsFactory({client, config}),
    ...getTokensFactory({client, config}),
    ...requestsFactory({config, request}),
    keys: () => (keys && keys.length ? JWKS.asKeyStore({keys}).toJWKS() : null),
    generators,
  }

  return moneyhub
}

import type * as Accounts from "../types/schema/account"
import type * as AuthRequests from "../types/schema/auth-request"
import type * as Balances from "../types/schema/balance"
import type * as Beneficiaries from "../types/schema/beneficiary"
import type * as Categories from "../types/schema/category"
import type * as Counterparties from "../types/schema/counterparty"
import type * as Holdings from "../types/schema/holding"
import type * as Payees from "../types/schema/payee"
import type * as Payments from "../types/schema/payment"
import type * as Projects from "../types/schema/project"
import type * as RegularTransactions from "../types/schema/regular-transaction"
import type * as RentalRecords from "../types/schema/rental-record"
import type * as SavingsGoals from "../types/schema/savings-goal"
import type * as SpendingAnalysis from "../types/schema/spending-analysis"
import type * as SpendingGoals from "../types/schema/spending-goal"
import type * as StandingOrders from "../types/schema/standing-order"
import type * as Syncs from "../types/schema/sync"
import type * as Taxes from "../types/schema/tax"
import type * as Transactions from "../types/schema/transaction"
import type * as Users from "../types/schema/user"

export {
  Accounts,
  AuthRequests,
  Balances,
  Beneficiaries,
  Categories,
  Counterparties,
  Holdings,
  Payees,
  Payments,
  Projects,
  RegularTransactions,
  RentalRecords,
  SavingsGoals,
  SpendingAnalysis,
  SpendingGoals,
  StandingOrders,
  Syncs,
  Taxes,
  Transactions,
  Users,
  ApiClientConfig,
  Moneyhub,
}
