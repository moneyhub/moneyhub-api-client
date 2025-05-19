import {ApiResponse, ExtraOptions} from "../../request"
import {WellKnownConnection} from "../../schema/connection"
import {GlobalCounterpartiesSearchParams, GlobalCounterparty} from "../../schema/counterparty"

export interface UnauthenticatedRequests {
  getGlobalCounterparties: (
    params?: GlobalCounterpartiesSearchParams,
    options?: ExtraOptions
  ) => Promise<ApiResponse<GlobalCounterparty[]>>

  listConnections: (query?: {clientId?: string}) => Promise<WellKnownConnection[]>
  listAPIConnections: (query?: {clientId?: string}) => Promise<WellKnownConnection[]>
  listTestConnections: (query?: {clientId?: string}) => Promise<WellKnownConnection[]>
  listBetaConnections: (query?: {clientId?: string}) => Promise<WellKnownConnection[]>
  listPaymentsConnections: (query?: {clientId?: string}) => Promise<WellKnownConnection[]>
  getOpenIdConfig: () => Promise<unknown>
}
