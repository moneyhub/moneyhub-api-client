import {
  TransactionSplitsRequests,
  TransactionSplitsRequestsParams,
} from '../types/requests/transaction-splits';

export default ({
  config,
  request,
}: TransactionSplitsRequestsParams): TransactionSplitsRequests => {
  const { resourceServerUrl } = config;
  return {
    splitTransaction: async ({ userId, transactionId, splits }) =>
      request(`${resourceServerUrl}/transactions/${transactionId}/splits`, {
        method: 'POST',
        cc: {
          scope: 'transactions:write:all',
          sub: userId,
        },
        body: splits,
      }),

    getTransactionSplits: async ({ userId, transactionId }) =>
      request(`${resourceServerUrl}/transactions/${transactionId}/splits`, {
        cc: {
          scope: 'transactions:read:all',
          sub: userId,
        },
      }),

    patchTransactionSplit: async ({ userId, transactionId, splitId, split }) =>
      request(`${resourceServerUrl}/transactions/${transactionId}/splits/${splitId}`, {
        method: 'PATCH',
        cc: {
          scope: 'transactions:write:all',
          sub: userId,
        },
        body: split,
      }),

    deleteTransactionSplits: async ({ userId, transactionId }) =>
      request(`${resourceServerUrl}/transactions/${transactionId}/splits`, {
        method: 'DELETE',
        cc: {
          scope: 'transactions:write:all',
          sub: userId,
        },
        returnStatus: true,
      }),
  };
};
