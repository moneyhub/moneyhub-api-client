import type { RequestsParams } from '..';
import type { RequestOptions } from '../request';

export type BeneficiariesRequestsParams = RequestsParams;

export default function BeneficiariesRequests({
  config,
  request,
}: BeneficiariesRequestsParams): BeneficiariesRequests;

export interface BeneficiariesRequests {
  getBeneficiary: ({ id, userId }: { id: string; userId: string }) => Promise<unknown>;
  getBeneficiaryWithDetail: ({ id, userId }: { id: string; userId: string }) => Promise<unknown>;
  getBeneficiaries: ({
    userId,
    params,
  }: {
    userId: string;
    params: RequestOptions['searchParams'];
  }) => Promise<unknown>;
  getBeneficiariesWithDetail: ({
    userId,
    params,
  }: {
    userId: string;
    params: RequestOptions['searchParams'];
  }) => Promise<unknown>;
}
