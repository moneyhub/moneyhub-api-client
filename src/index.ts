import {Issuer, custom, generators, type IssuerMetadata} from "openid-client"
import getAuthUrlsFactory from "./get-auth-urls"
import getTokensFactory from "./tokens"
import requestsFactory from "./requests"
import {evolve, pick} from "ramda"
import req from "./request"
import {getDiscovery, getDiscoveryWithGatewayUrl} from "./discovery"
import {createGetOpenIdConfig} from "./oidc-config"
import type {ApiClientConfig} from "./schema/config"
const DEFAULT_TIMEOUT = 60000
const DEFAULT_OIDC_CACHE_TTL_MS = 3600000 // 1 hour

function buildConfig(apiClientConfig: ApiClientConfig) {
  return evolve(
    {
      identityServiceUrl: (val: ApiClientConfig["identityServiceUrl"]) => val.replace("/oidc", ""),
      gatewayIdentityServiceUrl: (val: ApiClientConfig["gatewayIdentityServiceUrl"]) =>
        val == null ? val : val.replace(/\/oidc\/?$/, ""),
      caasResourceServerUrl: (val: ApiClientConfig["resourceServerUrl"]) =>
        `${val.replace(/\/v\d+(\.\d+)?\b/, "")}/caas/v1`,
    },
    {
      ...apiClientConfig,
      caasResourceServerUrl: apiClientConfig.resourceServerUrl,
    },
  )
}

function effectiveUrls(config: ReturnType<typeof buildConfig>) {
  return {
    identity: config.gatewayIdentityServiceUrl ?? config.identityServiceUrl,
    resource: config.gatewayResourceServerUrl ?? config.resourceServerUrl,
    caas: config.gatewayCaasResourceServerUrl ?? config.caasResourceServerUrl,
    osip: config.gatewayOsipResourceServerUrl ?? config.osipResourceServerUrl,
    accountConnect: config.gatewayAccountConnectUrl ?? config.accountConnectUrl,
  }
}

async function createOpenIdClient(
  config: ReturnType<typeof buildConfig>,
  urls: ReturnType<typeof effectiveUrls>,
  clientCreds: ApiClientConfig["client"],
  options: NonNullable<ApiClientConfig["options"]>,
) {
  const {timeout = DEFAULT_TIMEOUT} = options
  const {mTLS} = clientCreds
  custom.setHttpOptionsDefaults({
    timeout,
    ...mTLS ? {cert: mTLS.cert, key: mTLS.key} : {},
  })
  const discoveryOpts = {timeout, agent: options.agent, mTLS: mTLS ?? undefined}
  const discoveryMetadata = config.gatewayIdentityServiceUrl
    ? await getDiscoveryWithGatewayUrl(urls.identity, discoveryOpts)
    : await getDiscovery(urls.identity, discoveryOpts)
  const moneyhubIssuer = new Issuer(discoveryMetadata as IssuerMetadata)
  const client = new moneyhubIssuer.Client(
    {
      ...pick(["client_id", "client_secret", "id_token_signed_response_alg", "redirect_uri", "token_endpoint_auth_method", "request_object_signing_alg"], clientCreds),
      tls_client_certificate_bound_access_tokens: mTLS?.tls_client_certificate_bound_access_tokens || false,
    },
    // Cast keys: openid-client bundles its own jose; our jose JWK[] is compatible at runtime
    {keys: clientCreds.keys as any},
  )
  client[custom.clock_tolerance] = 10
  return client
}

const _Moneyhub = async (apiClientConfig: ApiClientConfig) => {
  const config = buildConfig(apiClientConfig)
  const urls = effectiveUrls(config)
  const {options = {}, client: clientCreds} = config
  const {timeout = DEFAULT_TIMEOUT, apiVersioning = true, openIdConfigCacheTtlMs = DEFAULT_OIDC_CACHE_TTL_MS, retry = {}} = options

  const client = await createOpenIdClient(config, urls, clientCreds, options)

  const requestFn = req({
    client,
    options: {timeout, apiVersioning, agent: options.agent, mTLS: clientCreds.mTLS, retry},
    identityServiceUrl: urls.identity,
    gatewayResourceServerUrl: config.gatewayResourceServerUrl,
    gatewayCaasResourceServerUrl: config.gatewayCaasResourceServerUrl,
    gatewayOsipResourceServerUrl: config.gatewayOsipResourceServerUrl,
  })

  const getOpenIdConfig = createGetOpenIdConfig({
    identityServiceUrl: urls.identity,
    gatewayIdentityServiceUrl: config.gatewayIdentityServiceUrl,
    openIdConfigCacheTtlMs,
    request: requestFn,
  })

  const configWithGetOpenIdConfig = {
    ...config,
    resourceServerUrl: urls.resource,
    identityServiceUrl: urls.identity,
    caasResourceServerUrl: urls.caas,
    osipResourceServerUrl: urls.osip,
    accountConnectUrl: urls.accountConnect,
    getOpenIdConfig,
  }

  return {
    ...getAuthUrlsFactory({client, config: configWithGetOpenIdConfig}),
    ...getTokensFactory({client, config: configWithGetOpenIdConfig}),
    ...requestsFactory({config: configWithGetOpenIdConfig, request: requestFn}),
    keys: () => (clientCreds.keys?.length ? {keys: clientCreds.keys} : null),
    generators,
  }
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
