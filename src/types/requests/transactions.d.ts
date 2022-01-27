import type { RequestsParams } from "..";
import type { RequestOptions } from "../request";

export type TransactionsRequestsParams = RequestsParams;

export default function TransactionsRequests({ config, request }: TransactionsRequestsParams): TransactionsRequests;

interface TransactionsRequests {
    getTransactions: ({ userId, params }: { userId: string; params?: RequestOptions["searchParams"] }) => Promise<unknown>;
    getTransaction: ({ userId, transactionId }: { userId: string; transactionId: string }) => Promise<unknown>;
    addTransaction: ({ userId, transaction }: { userId: string; transaction: Record<string, any> }) => Promise<unknown>;
    addTransactions: ({ userId, transactions, params = {} }: { userId: string; transactions: Record<string, any>[]; params?: RequestOptions["searchParams"] }) => Promise<unknown>;
    updateTransaction: ({ userId, transactionId, transaction }: { userId: string; transactionId: string; transaction: Record<string, any> }) => Promise<unknown>;
    deleteTransaction: ({ userId, transactionId }: { userId: string; transactionId: string }) => Promise<unknown>;
}
