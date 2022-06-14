const config = require("config")
const {Moneyhub} = require("../src/index")

const setupMoneyhubClient = async (config) => Moneyhub(config)

const {setupTestData} = require("./setup-test-data")
const {teardownTestData} = require("./teardown-test-data")

exports.mochaHooks = async () => {
  const moneyhub = await setupMoneyhubClient(config)
  return {
    async beforeAll() {
      this.config = await setupTestData(config, moneyhub)
    },
    async afterAll() {
      return await teardownTestData(this.config, moneyhub)
    }
  }

}
