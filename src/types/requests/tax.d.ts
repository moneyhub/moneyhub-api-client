import type { RequestsParams } from "..";
import type { RequestOptions } from "../request";

export type TaxRequestsParams = RequestsParams;

export default function TaxRequests({ config, request }: TaxRequestsParams): TaxRequests;

interface TaxRequests {
    getTaxReturn: ({ userId, params = {} }: { userId: string; params?: RequestOptions["searchParams"] }) => Promise<unknown>;
}
