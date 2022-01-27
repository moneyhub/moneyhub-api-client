/* eslint-disable max-nested-callbacks */
const Moneyhub = require('..');
const config = require('../../test/test-client-config');
const { expect } = require('chai');

describe('Auth requests', () => {
  let moneyhub;

  before(async () => {
    moneyhub = await Moneyhub(config);
  });

  it('creates payment auth request', async () => {
    const { testPayeeId } = config;
    const { data } = await moneyhub.createAuthRequest({
      scope: 'openid payment id:1ffe704d39629a929c8e293880fb449a',
      payment: {
        payeeId: testPayeeId,
        amount: 15,
        payeeRef: 'Payee ref',
        payerRef: 'Payer ref',
      },
      redirectUri: config.client.redirect_uri,
    });
    expect(data).to.have.property('id');
    expect(data).to.have.property('status', 'pending');
    expect(data).to.have.property('redirectParams');
    expect(data.redirectParams).to.have.property('authUrl');
    expect(data.redirectParams).to.have.property('returnUrl');
    expect(data.redirectParams).to.have.property('state');
  });
});
