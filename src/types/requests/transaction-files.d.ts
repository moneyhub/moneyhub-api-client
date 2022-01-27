import type { RequestsParams } from '..';

export type TransactionFilesRequestsParams = RequestsParams;

export default function TransactionFilesRequests({
  config,
  request,
}: TransactionFilesRequestsParams): TransactionFilesRequests;

interface TransactionFilesRequests {
  addFileToTransaction: ({
    userId,
    transactionId,
    fileData,
    fileName,
  }: {
    userId: string;
    transactionId: string;
    fileData: string | Buffer;
    fileName: string;
  }) => Promise<unknown>;
  getTransactionFiles: ({
    userId,
    transactionId,
  }: {
    userId: string;
    transactionId: string;
  }) => Promise<unknown>;
  getTransactionFile: ({
    userId,
    transactionId,
    fileId,
  }: {
    userId: string;
    transactionId: string;
    fileId: string;
  }) => Promise<unknown>;
  deleteTransactionFile: ({
    userId,
    transactionId,
    fileId,
  }: {
    userId: string;
    transactionId: string;
    fileId: string;
  }) => Promise<unknown>;
}
