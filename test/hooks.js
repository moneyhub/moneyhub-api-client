const config = require("config")
const {Moneyhub} = require("../src/index")

const setupMoneyhubClient = async (config) => Moneyhub(config)

const {setupTestData} = require("./setup-test-data")
const {teardownTestData} = require("./teardown-test-data")

exports.mochaHooks = async () => {
  const moneyhub = await setupMoneyhubClient(config)
  let testConfig = null

  return {
    async beforeAll() {
      testConfig = await setupTestData(config, moneyhub)
      this.config = testConfig
    },
    
    async afterAll() {
      if (testConfig) {
        await teardownTestData(testConfig, moneyhub)
      }
    }
  }
}