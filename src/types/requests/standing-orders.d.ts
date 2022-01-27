import type { RequestsParams } from "..";
import type { RequestOptions } from "../request";

export type StandingOrdersRequestsParams = RequestsParams;

export default function StandingOrdersRequests({
  config,
  request,
}: StandingOrdersRequestsParams): StandingOrdersRequests;

interface StandingOrdersRequests {
  getStandingOrders: (params: RequestOptions["searchParams"]) => Promise<unknown>;
  getStandingOrder: ({ id }: { id: string }) => Promise<unknown>;
}
