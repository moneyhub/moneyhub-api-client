import type { RequestsParams } from '..';

export type TransactionSplitsRequestsParams = RequestsParams;

export default function TransactionSplitsRequests({
  config,
  request,
}: TransactionSplitsRequestsParams): TransactionSplitsRequests;

interface TransactionSplitsRequests {
  splitTransaction: ({
    userId,
    transactionId,
    splits,
  }: {
    userId: string;
    transactionId: string;
    splits: Record<string, any>;
  }) => Promise<unknown>;

  getTransactionSplits: ({
    userId,
    transactionId,
  }: {
    userId: string;
    transactionId: string;
  }) => Promise<unknown>;

  patchTransactionSplit: ({
    userId,
    transactionId,
    splitId,
    split,
  }: {
    userId: string;
    transactionId: string;
    splitId: string;
    split: Record<string, any>;
  }) => Promise<unknown>;

  deleteTransactionSplits: ({
    userId,
    transactionId,
  }: {
    userId: string;
    transactionId: string;
  }) => Promise<unknown>;
}
