const config = require("config")
const {Moneyhub} = require("../../src/index")
const {setupTestData} = require("./setup-test-data")
const {teardownTestData} = require("./teardown-test-data")

const setupMoneyhubClient = async (clientConfig) => Moneyhub(clientConfig)

function printWarning(message) {
  const firstLine = message.split("\n")[0]
  const border = "*".repeat(firstLine.length + 4)
  console.warn(`\n${border}\n* ${message}\n${border}\n`)
}

function buildConfigWarnings({userId, accountId, openapiUrl, regularTransactionsAccount, shouldTestEnhancedTransactions}) {
  const missing = [
    !userId && "userId",
    !accountId && "accountId",
    !openapiUrl && "openapiUrl",
    !regularTransactionsAccount && "regularTransactionsAccount",
    shouldTestEnhancedTransactions === undefined && "shouldTestEnhancedTransactions",
  ].filter(Boolean)

  if (!missing.length) return []

  return [
    `MISSING CAAS CONFIG: ${missing.join(", ")} — some tests were skipped\n\n` +
    "Expected config structure:\n" +
    JSON.stringify({
      caas: {
        openapiUrl: "https://<api-gateway>.co.uk/caas/openapi.json",
        userId: "user-id-12345678",
        accountId: "account-id-12345678",
        regularTransactionsAccount: "account-id-with-regular-transactions",
        shouldTestEnhancedTransactions: false,
      },
    }, null, 2),
  ]
}

exports.mochaHooks = async () => {
  const {
    caas: {
      userId,
      accountId,
      openapiUrl,
      regularTransactionsAccount,
      shouldTestEnhancedTransactions,
    } = {},
  } = config
  const warnings = buildConfigWarnings({userId, accountId, openapiUrl, regularTransactionsAccount, shouldTestEnhancedTransactions})

  if (warnings.length) {
    process.once("exit", () => warnings.forEach(printWarning))
  }

  const moneyhub = await setupMoneyhubClient(config)
  return {
    async beforeAll() {
      const {transactionIds, geotagIds, counterpartyIds} = await setupTestData(config, moneyhub)

      this.config = config
      this.skipTestsRequiringCaasIds = !userId || !accountId
      this.skipTestsRequiringRegularTransactionsAccount = !regularTransactionsAccount
      this.skipTestsRequiringEnhancedTransactions = !shouldTestEnhancedTransactions
      this.transactionIds = transactionIds
      this.geotagIds = geotagIds
      this.counterpartyIds = counterpartyIds
    },


    async afterAll() {
      await teardownTestData(config, moneyhub)
    }
  }
}
