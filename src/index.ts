import {Issuer, custom, generators, type IssuerMetadata} from "openid-client"
import getAuthUrlsFactory from "./get-auth-urls"
import getTokensFactory from "./tokens"
import requestsFactory from "./requests"
import * as R from "ramda"
import req from "./request"
import {getDiscoveryWithBaseUrl} from "./discovery"
import type {ApiClientConfig} from "./schema/config"
const DEFAULT_TIMEOUT = 60000

const _Moneyhub = async (apiClientConfig: ApiClientConfig) => {
  const config = R.evolve(
    {
      identityServiceUrl: (val: ApiClientConfig["identityServiceUrl"]) => val.replace("/oidc", ""),
      caasResourceServerUrl: (val: ApiClientConfig["resourceServerUrl"]) =>
        `${val.replace(/\/v\d+(\.\d+)?\b/, "")}/caas/v1`,
    },
    {
      ...apiClientConfig,
      caasResourceServerUrl: apiClientConfig.resourceServerUrl,
    },
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
      mTLS,
    },
  } = config

  const {timeout = DEFAULT_TIMEOUT, apiVersioning = true, agent, retry = {}} = options

  custom.setHttpOptionsDefaults({
    timeout,
    ...mTLS ? {
      cert: mTLS.cert,
      key: mTLS.key,
    } : {},
  })

  const discoveryMetadata = await getDiscoveryWithBaseUrl(identityServiceUrl, {
    timeout,
    agent: options.agent,
    mTLS: mTLS ?? undefined,
  })
  const moneyhubIssuer = new Issuer(discoveryMetadata as IssuerMetadata)

  const client = new moneyhubIssuer.Client(
    {
      client_id,
      client_secret,
      id_token_signed_response_alg,
      redirect_uri,
      token_endpoint_auth_method,
      request_object_signing_alg,
      tls_client_certificate_bound_access_tokens: mTLS?.tls_client_certificate_bound_access_tokens || false,
    },
    {keys},
  )

  client[custom.clock_tolerance] = 10

  const configWithCache = {
    ...config,
    cachedOpenIdConfig: discoveryMetadata,
  }

  const request = req({
    client,
    options: {timeout, apiVersioning, agent, mTLS, retry},
    resourceServerUrl: config.resourceServerUrl,
  })

  const moneyhub = {
    ...getAuthUrlsFactory({client, config}),
    ...getTokensFactory({client, config}),
    ...requestsFactory({config: configWithCache, request}),
    keys: () => (keys && keys.length ? {keys} : null),
    generators,
  }

  return moneyhub
}

export type MoneyhubInstance = Awaited<ReturnType<typeof _Moneyhub>>
const Moneyhub: (apiClientConfig: ApiClientConfig) => Promise<MoneyhubInstance> = _Moneyhub

import type * as Accounts from "./schema/account"
import type * as Affordability from "./schema/affordability"
import type * as AuthRequests from "./schema/auth-request"
import type * as Balances from "./schema/balance"
import type * as Beneficiaries from "./schema/beneficiary"
import type * as Categories from "./schema/category"
import type * as CategorisedTransactions from "./schema/categorised-transactions"
import type * as Counterparties from "./schema/counterparty"
import type * as Connections from "./schema/connection"
import type * as Holdings from "./schema/holding"
import type * as NotificationThresholds from "./schema/notification-threshold"
import type * as Osip from "./schema/osip"
import type * as Payees from "./schema/payee"
import type * as Payments from "./schema/payment"
import type * as Projects from "./schema/project"
import type * as RegularTransactions from "./schema/regular-transaction"
import type * as RentalRecords from "./schema/rental-record"
import type * as SavingsGoals from "./schema/savings-goal"
import type * as SpendingAnalysis from "./schema/spending-analysis"
import type * as SpendingGoals from "./schema/spending-goal"
import type * as StandingOrders from "./schema/standing-order"
import type * as Statements from "./schema/statement"
import type * as Syncs from "./schema/sync"
import type * as Taxes from "./schema/tax"
import type * as Transactions from "./schema/transaction"
import type * as Users from "./schema/user"

export {
  Accounts,
  Affordability,
  AuthRequests,
  Balances,
  Beneficiaries,
  Categories,
  CategorisedTransactions,
  Counterparties,
  Connections,
  Holdings,
  NotificationThresholds,
  Osip,
  Payees,
  Payments,
  Projects,
  RegularTransactions,
  RentalRecords,
  SavingsGoals,
  SpendingAnalysis,
  SpendingGoals,
  StandingOrders,
  Statements,
  Syncs,
  Taxes,
  Transactions,
  Users,
  ApiClientConfig,
  Moneyhub,
}
