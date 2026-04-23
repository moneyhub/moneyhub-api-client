const {transactions} = require("./test-data")

exports.setupTestData = async function(config, moneyhub) {
  const {caas: {userId, accountId} = {}} = config

  if (!userId || !accountId) {
    return {transactionIds: [], counterpartyIds: [], geotagIds: []}
  }

  const transactionsWithUserAndAccountIds = transactions.map((trx) => ({...trx, userId, accountId}))

  const {data} = await moneyhub.caasEnrichTransactions({transactions: transactionsWithUserAndAccountIds})

  const {transactionIds, counterpartyIds, geotagIds} = data.reduce((acc, curr) => {
    acc.transactionIds.push(curr.transactionId)

    const counterpartyId = curr.mhInsights?.l3Counterparty?.l3CounterpartyId
    if (counterpartyId) {
      acc.counterpartyIds.push(counterpartyId)
    }

    const geotags = curr.mhInsights?.geotags ?? []
    geotags.forEach(({geotagId}) => {
      acc.geotagIds.push(geotagId)
    })

    return acc
  }, {transactionIds: [], counterpartyIds: [], geotagIds: []})

  return {
    transactionIds,
    counterpartyIds,
    geotagIds,
  }
}
