import type { RequestsParams } from '..';
import type { RequestOptions } from '../request';

export type PaymentsRequestsParams = RequestsParams;

export default function PaymentsRequests({
  config,
  request,
}: PaymentsRequestsParams): PaymentsRequests;

interface PaymentsRequests {
  getPayment: ({ id }: { id: string }) => Promise<unknown>;
  getPayments: (params: RequestOptions['searchParams']) => Promise<unknown>;
  getPaymentFromIDToken: ({ idToken }: { idToken: string }) => Promise<unknown>;
}
