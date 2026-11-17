const {Moneyhub} = require("../../src/index")
const config = require("../config")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const MOCK_BANK_NAME = "Moneyhub Open Banking Mock"
const DEFAULT_DAYS_FROM_NOW = 3
const DAY_IN_MS = 24 * 60 * 60 * 1000

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "connectionId", alias: "c", type: String, description: `optional, defaults to the user's "${MOCK_BANK_NAME}" connection`},
  {name: "days", alias: "d", type: Number, description: `optional, days from now until expiry, 0 or more (default ${DEFAULT_DAYS_FROM_NOW}). 0 expires at the end of today`},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const {userId, connectionId, days = DEFAULT_DAYS_FROM_NOW} = commandLineArgs(optionDefinitions)

if (!userId) throw new Error("userId is required")
if (days < 0) throw new Error("days must be 0 or more: the API rejects expiry dates in the past")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const targetConnectionId = connectionId || await findMockBankConnectionId(moneyhub, userId)
    const expiresAt = expiryDate(days).toISOString()

    const status = await moneyhub.updateUserConnection({userId, connectionId: targetConnectionId, expiresAt})
    console.log(`Status ${status}: connection ${targetConnectionId} now expires at ${expiresAt}`)
  } catch (e) {
    console.error(e)
    if (e.response) console.error(e.response.body)
  }
}

// The API rejects any expiry that has already passed, so "today" has to mean later today
const expiryDate = (days) => {
  if (days > 0) return new Date(Date.now() + days * DAY_IN_MS)

  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 0)
  return endOfToday
}

const findMockBankConnectionId = async (moneyhub, userId) => {
  const {data: connections} = await moneyhub.getUserConnections({userId})
  const mockBankConnection = connections.find(({name}) => name === MOCK_BANK_NAME)

  if (!mockBankConnection) {
    const names = connections.map(({name}) => name).join(", ") || "none"
    throw new Error(`No "${MOCK_BANK_NAME}" connection found for user ${userId}. Connections: ${names}`)
  }

  return mockBankConnection.id
}

start()
