/* eslint-disable max-nested-callbacks */
const Moneyhub = require('..');
const config = require('../../test/test-client-config');
const { expect } = require('chai');

const userId = config.testUserId;

describe('Transactions', () => {
  let moneyhub;
  let transactionId;
  before(async () => {
    moneyhub = await Moneyhub(config);
  });

  it('can get transactions', async () => {
    const { data: transactions } = await moneyhub.getTransactions({
      userId,
    });

    expect(transactions.length).to.be.greaterThan(1);
  });

  it('can get transactions with limit', async () => {
    const { data: transactions } = await moneyhub.getTransactions({
      userId,
      params: { limit: 1 },
    });

    transactionId = transactions[0].id;

    expect(transactions.length).to.eql(1);
  });

  it('can get one transaction', async () => {
    const { data: transaction } = await moneyhub.getTransaction({
      userId,
      transactionId,
    });

    expect(transaction.id).to.equal(transactionId);
  });

  it('can update one transaction', async () => {
    const shortDescription = new Date().toISOString();
    const transaction = {
      amount: {
        value: 5400,
      },
      shortDescription,
    };

    const { data } = await moneyhub.updateTransaction({
      userId,
      transactionId,
      transaction,
    });

    expect(data.shortDescription).to.equal(shortDescription);
  });

  describe('creating and deleting a manual transaction', () => {
    let accountId, transactionId;
    before(async () => {
      const account = {
        accountName: 'Account name',
        providerName: 'Provider name',
        type: 'cash:current',
        accountType: 'personal',
        balance: {
          date: '2018-08-12',
          amount: {
            value: 300023,
          },
        },
      };

      const {
        data: { id },
      } = await moneyhub.createAccount({ userId, account });
      accountId = id;
    });

    after(async () => {
      await moneyhub.deleteAccount({ userId, accountId });
    });

    it('creates a transaction', async () => {
      const transaction = {
        accountId,
        amount: {
          value: -2300,
        },
        categoryId: 'std:4b0255f0-0309-4509-9e05-4b4e386f9b0d',
        categoryIdConfirmed: true,
        longDescription: 'New transaction',
        shortDescription: 'transaction',
        notes: 'notes',
        status: 'posted',
        date: '2018-07-10T12:00:00+00:00',
      };

      const { data } = await moneyhub.addTransaction({ userId, transaction });
      transactionId = data.id;
      expect(data).to.have.property('id');
    });

    it('deletes transaction', async () => {
      const status = await moneyhub.deleteTransaction({
        userId,
        transactionId,
      });
      expect(status).to.equal(204);
    });
  });
});
