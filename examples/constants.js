const DEFAULT_DATA_SCOPES_USE_CASE_1 =
"accounts:read transactions:read:all categories:read categories:write spending_goals:read savings_goals:read"
const DEFAULT_DATA_SCOPES_USE_CASE_2 =
"accounts:read accounts:write:all transactions:read:all transactions:write:all categories:read categories:write spending_goals:read spending_goals:write:all savings_goals:read savings_goals:write:all spending_analysis:read"

const BANK_IDS = {
  ALL: "all",
  LEGACY: "legacy",
  TEST: "test",
  MONZO: "fa37a6ecc38eea38bdf3dd0fdcb68fab",
  DAG_BANK_TEST: "1b3cd579899b5f5b666c15561a48c8b6",
  DAG_INVESTMENT_TEST: "06995ed5c6c6f25e323b34dc45968426",
  MODELO_OPEN_BANKING_TEST: "b74f1a79f0be8bdb857d82d0f041d7d2",
  MONEYHUB_OPEN_BANKING_TEST: "1ffe704d39629a929c8e293880fb449a",
}
const DEFAULT_BANK_ID = BANK_IDS.MODELO_OPEN_BANKING_TEST
const DEFAULT_STATE = "foo"
const DEFAULT_NONCE = "bar"

module.exports = {
  BANK_IDS,
  DEFAULT_BANK_ID,
  DEFAULT_NONCE,
  DEFAULT_STATE,
  DEFAULT_DATA_SCOPES_USE_CASE_1,
  DEFAULT_DATA_SCOPES_USE_CASE_2,
}
