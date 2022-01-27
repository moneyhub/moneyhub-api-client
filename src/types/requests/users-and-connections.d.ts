import type { RequestsParams, SearchParams } from '..';

export type UsersAndConnectionsRequestsParams = RequestsParams;

export default function UsersAndConnectionsRequests({
  config,
  request,
}: UsersAndConnectionsRequestsParams): UsersAndConnectionsRequests;

interface UsersAndConnectionsRequests {
  registerUser: ({ clientUserId }: { clientUserId: string }) => Promise<unknown>;
  getUsers: (params: SearchParams) => Promise<unknown>;
  getSCIMUsers: (params: SearchParams) => Promise<unknown>;
  getUser: ({ userId }: { userId: string }) => Promise<unknown>;
  getUserConnections: ({ userId }: { userId: string }) => Promise<unknown>;
  deleteUserConnection: ({
    userId,
    connectionId,
  }: {
    userId: string;
    connectionId: string;
  }) => Promise<unknown>;
  deleteUser: ({ userId }: { userId: string }) => Promise<unknown>;
}
