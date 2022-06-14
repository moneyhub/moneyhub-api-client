const {account, payee, transactions} = require("./test-data")
const {pensionAccount, currentAccount} = account

const setupTestUser = async ({moneyhub}) => await moneyhub.registerUser({})
const setupTestAccounts = async ({moneyhub, userId}) => {
  return Promise.all([
    moneyhub.createAccount({userId, account: currentAccount}),
    moneyhub.createAccount({userId, account: pensionAccount})
  ])
}
const setupPayee = async ({moneyhub, userId}) => await moneyhub.addPayee({
  ...payee,
  userId
})
const setupTransaction = async ({moneyhub, userId, accountId}) => {
  const date = new Date().toISOString()
  return moneyhub.addTransactions({
    userId,
    transactions: transactions.map((trx) => ({...trx, accountId, date})),
    params: {accountId},
  })
}

exports.setupTestData = async function(config, moneyhub) {
  const {userId} = await setupTestUser({moneyhub})
  const [{data: {id: accountId}}] = await setupTestAccounts({moneyhub, userId})
  const {data: {id: payeeId}} = await setupPayee({moneyhub, userId})
  const {data: {id: transactionId}} = await setupTransaction({moneyhub, userId, accountId})
  return {
    ...config,
    testUserId: userId,
    testAccountId: accountId,
    testPayeeId: payeeId,
    testTransactionId: transactionId
  }
}
