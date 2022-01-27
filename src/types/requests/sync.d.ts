import type { RequestsParams } from '..';

export type SyncRequestsParams = RequestsParams;

export default function SyncRequests({ config, request }: SyncRequestsParams): SyncRequests;

interface SyncRequests {
  syncUserConnection: ({
    userId,
    connectionId,
    customerIpAddress,
    customerLastLoggedTime,
  }: {
    userId: string;
    connectionId: string;
    customerIpAddress?: string;
    customerLastLoggedTime?: string;
  }) => Promise<unknown>;
}
