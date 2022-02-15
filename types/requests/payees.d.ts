import type { RequestsParams } from '..';
import type { RequestOptions } from '../request';

export type PayeesRequestsParams = RequestsParams;

export default function PayeesRequests({ config, request }: PayeesRequestsParams): PayeesRequests;

interface PayeesRequests {
  addPayee: ({
    accountNumber,
    sortCode,
    name,
    externalId,
    userId,
  }: {
    accountNumber: string;
    sortCode: string;
    name: string;
    externalId: string;
    userId: string;
  }) => Promise<unknown>;
  getPayees: (params: RequestOptions['searchParams']) => Promise<unknown>;
  getPayee: ({ id }: { id: string }) => Promise<unknown>;
}
