import type { RequestsParams } from "..";
import type { RequestOptions } from "../request";

export type UnauthenticatedRequestsParams = RequestsParams;

export default function UnauthenticatedRequests({
  config,
  request,
}: UnauthenticatedRequestsParams): UnauthenticatedRequests;

interface UnauthenticatedRequests {
  getGlobalCounterparties: () => Promise<unknown>;
  listConnections: () => Promise<unknown>;
  listAPIConnections: () => Promise<unknown>;
  listTestConnections: () => Promise<unknown>;
  getOpenIdConfig: () => Promise<unknown>;
}
