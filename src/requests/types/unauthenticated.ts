import {ApiResponse} from "src/request"
import {WellKnownConnection} from "src/schema/connection"
import {GlobalCounterpartiesSearchParams, GlobalCounterparty} from "src/schema/counterparty"

export interface UnauthenticatedRequests {
  getGlobalCounterparties: (
    params?: GlobalCounterpartiesSearchParams
  ) => Promise<ApiResponse<GlobalCounterparty[]>>

  listConnections: () => Promise<WellKnownConnection[]>
  listAPIConnections: () => Promise<WellKnownConnection[]>
  listTestConnections: () => Promise<WellKnownConnection[]>
  listBetaConnections: () => Promise<WellKnownConnection[]>
  getOpenIdConfig: () => Promise<unknown>
}
