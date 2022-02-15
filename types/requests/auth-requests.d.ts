import { RequestsParams } from '..';

export type AuthRequestsParams = RequestsParams;
export default function AuthRequests({ config, request }: AuthRequestsParams): AuthRequests;

export interface AuthRequests {
  createAuthRequest: (params: CreateAuthRequestParams) => Promise<unknown>;
  completeAuthRequest: (params: CompleteAuthRequestParams) => Promise<unknown>;
  getAllAuthRequests: (params: GetAllAuthRequestsParams) => Promise<unknown>;
  getAuthRequest: (params: { id: string }) => Promise<unknown>;
}

interface CreateAuthRequestParams {
  redirectUri: string;
  payment: {
    payeeId: string;
    amount: number;
    payeeRef: string;
    payerRef: string;
  };
  scope: string;
  reversePayment: {
    paymentId: string;
  };
  connectionId: string;
  userId: string;
  categorisationType: string;
  permissions: string[];
  standingOrder: unknown;
}

interface CompleteAuthRequestParams {
  id: string;
  authParams: {
    code: string;
    state: string;
    id_token: string;
  };
}

interface GetAllAuthRequestsParams extends Record<string, string> {
  limit: string;
  offset: string;
}
