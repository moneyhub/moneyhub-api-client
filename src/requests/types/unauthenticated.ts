import {ApiResponse, ExtraOptions} from "../../request"
import {WellKnownConnection} from "../../schema/connection"
import {GlobalCounterpartiesSearchParams, GlobalCounterpartyV3} from "../../schema/counterparty"

export interface UnauthenticatedRequests {
  getGlobalCounterparties: (
    params?: GlobalCounterpartiesSearchParams,
    options?: ExtraOptions
  ) => Promise<ApiResponse<GlobalCounterpartyV3[]>>

  listConnections: (query?: {clientId?: string}) => Promise<WellKnownConnection[]>
  listAPIConnections: (query?: {clientId?: string}) => Promise<WellKnownConnection[]>
  listTestConnections: (query?: {clientId?: string}) => Promise<WellKnownConnection[]>
  listBetaConnections: (query?: {clientId?: string}) => Promise<WellKnownConnection[]>
  listPaymentsConnections: (query?: {clientId?: string}) => Promise<WellKnownConnection[]>
  getOpenIdConfig: () => Promise<unknown>
}
