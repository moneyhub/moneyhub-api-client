import { Issuer, custom } from 'openid-client';
import R from 'ramda';
import { JWKS } from 'jose';
import getAuthUrlsFactory from './get-auth-urls';
import getTokensFactory from './tokens';
import requestFactories from './requests';
import req from './request';
import type { APIClientConfig, MoneyHub } from '../types';
const DEFAULT_TIMEOUT = 60000;

export default async (apiClientConfig: APIClientConfig): Promise<MoneyHub> => {
  const config = R.evolve(
    {
      identityServiceUrl: (val: APIClientConfig['identityServiceUrl']) => val.replace('/oidc', ''),
    },
    apiClientConfig,
  );

  const {
    identityServiceUrl,
    options = {},
    client: {
      client_id,
      client_secret,
      id_token_signed_response_alg,
      request_object_signing_alg,
      redirect_uri,
      keys,
      token_endpoint_auth_method,
    },
  } = config;

  const { timeout = DEFAULT_TIMEOUT } = options;

  custom.setHttpOptionsDefaults({
    timeout,
  });

  const moneyhubIssuer = await Issuer.discover(identityServiceUrl + '/oidc');

  const client = new moneyhubIssuer.Client(
    {
      client_id,
      client_secret,
      id_token_signed_response_alg,
      redirect_uri,
      token_endpoint_auth_method,
      request_object_signing_alg,
    },
    { keys },
  );

  client[custom.clock_tolerance] = 10;

  const request = req({
    client,
    options: { timeout },
  });

  const moneyhub = {
    ...R.mergeAll(requestFactories.map((fn) => fn({ request, config }))),
    ...getAuthUrlsFactory({ client, config }),
    ...getTokensFactory({ client, config }),

    keys: () => (keys && keys.length ? JWKS.asKeyStore({ keys }).toJWKS() : null),
  };

  return moneyhub;
};
