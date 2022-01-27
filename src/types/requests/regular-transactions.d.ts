import type { RequestsParams } from "..";
import type { RequestOptions } from "../request";

export type RegularTransactionsRequestsParams = RequestsParams;

export default function RegularTransactionsRequests({ config, request }: RegularTransactionsRequestsParams): RegularTransactionsRequests;

interface RegularTransactionsRequests {
    getRegularTransactions: ({ userId, params = {}}: { userId: string; params?: RequestOptions["searchParams"]}) => Promise<unknown>;
}
