import {
  StandingOrdersRequests,
  StandingOrdersRequestsParams,
} from '../../types/requests/standing-orders';

export default ({ config, request }: StandingOrdersRequestsParams): StandingOrdersRequests => {
  const { identityServiceUrl } = config;

  const getStandingOrder = ({ id }: { id: string }) =>
    request(`${identityServiceUrl}/standing-orders/${id}`, {
      cc: {
        scope: 'payment:read',
      },
    });

  return {
    getStandingOrder,
    getStandingOrders: (params = {}) =>
      request(`${identityServiceUrl}/standing-orders`, {
        searchParams: params,
        cc: {
          scope: 'payment:read',
        },
      }),
  };
};
