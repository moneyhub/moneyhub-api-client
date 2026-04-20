const config = require("config")
const {Moneyhub} = require("../../src/index")
const {setupTestData} = require("./setup-test-data")
const {teardownTestData} = require("./teardown-test-data")

const setupMoneyhubClient = async (config) => Moneyhub(config)

function printWarning(message) {
  const firstLine = message.split("\n")[0]
  const border = "*".repeat(firstLine.length + 4)
  console.warn(`\n${border}\n* ${message}\n${border}\n`)
}

exports.mochaHooks = async () => {
  const {caas: {userId, accountId, swaggerUrl} = {}} = config

  const missing = [
    !userId && "userId",
    !accountId && "accountId",
    !swaggerUrl && "swaggerUrl",
  ].filter(Boolean)

  if (missing.length) {
    printWarning(
      `MISSING CAAS CONFIG: ${missing.join(", ")} — some tests will be skipped\n\n` +
      "Expected config structure:\n" +
      JSON.stringify({
        caas: {
          swaggerUrl: "https://<api-gateway>.co.uk/caas/swagger-enrichment-engine.json",
          userId: "user-id-12345678",
          accountId: "account-id-12345678",
        },
      }, null, 2),
    )
  }

  const moneyhub = await setupMoneyhubClient(config)
  return {
    async beforeAll() {
      const {transactionIds, geotagIds, counterpartyIds} = await setupTestData(config, moneyhub)

      this.config = config
      this.skipSwaggerTests = !swaggerUrl
      this.skipTestsRequiringUserId = !userId
      this.skipTestsRequiringAccountId = !accountId
      this.transactionIds = transactionIds
      this.geotagIds = geotagIds
      this.counterpartyIds = counterpartyIds
    },


    async afterAll() {
      await teardownTestData(config, moneyhub)
    }
  }
}
