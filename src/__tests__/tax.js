/* eslint-disable max-nested-callbacks */
const Moneyhub = require('..');
const config = require('../../test/test-client-config');
const { expect } = require('chai');

const userId = config.testUserId;

describe('Tax', () => {
  let moneyhub;
  before(async () => {
    moneyhub = await Moneyhub(config);
  });

  it('can get a tax return', async () => {
    const startDate = '2019-01-01';
    const endDate = '2020-01-01';
    const { data: tax } = await moneyhub.getTaxReturn({
      userId,
      params: {
        startDate,
        endDate,
      },
    });

    expect(tax.dateTo).to.eql(endDate);
    expect(tax.dateFrom).to.eql(startDate);
    expect(tax.taxReturn.sa105).to.be.an('object');
  });
});
