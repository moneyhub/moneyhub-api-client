
const DEFAULT_DATA_SCOPES =
"accounts:read accounts:write:all transactions:read:all transactions:write:all categories:read categories:write spending_goals:read spending_goals:write:all savings_goals:read savings_goals:write:all"

const BANK_IDS = {
  MONZO: "fa37a6ecc38eea38bdf3dd0fdcb68fab",
  DAG_BANK_TEST: "1b3cd579899b5f5b666c15561a48c8b6",
  MODELO_OPEN_BANKING_TEST: "b74f1a79f0be8bdb857d82d0f041d7d2",
}
const DEFAULT_BANK_ID = BANK_IDS.MODELO_OPEN_BANKING_TEST
const DEFAULT_STATE = "foo"

module.exports = {
  BANK_IDS,
  DEFAULT_BANK_ID,
  DEFAULT_STATE,
  DEFAULT_DATA_SCOPES,
}
