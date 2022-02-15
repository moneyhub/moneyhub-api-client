import { TaxRequests, TaxRequestsParams } from '../../types/requests/tax';

export default ({ config, request }: TaxRequestsParams): TaxRequests => {
  const { resourceServerUrl } = config;
  const filterNullOrUndefined = (obj: Record<string, any>) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
  return {
    getTaxReturn: ({ userId, params }) =>
      request(`${resourceServerUrl}/tax`, {
        searchParams: typeof params === 'object' ? filterNullOrUndefined(params) : params,
        cc: {
          scope: 'tax:read',
          sub: userId,
        },
      }),
  };
};
