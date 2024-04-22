const DEFAULT_DATA_SCOPES_USE_CASE_1 = [
  "accounts:read",
  "transactions:read:all",
  "categories:read",
  "categories:write",
  "spending_goals:read",
  "savings_goals:read"
].join(" ")

const DEFAULT_DATA_SCOPES_USE_CASE_2 = [
  "accounts:read",
  "accounts:write:all",
  "affordability:read",
  "affordability:write",
  "transactions:read:all",
  "transactions:write:all",
  "categories:read",
  "categories:write",
  "spending_goals:read",
  "spending_goals:write:all",
  "savings_goals:read",
  "savings_goals:write:all",
  "spending_analysis:read",
  "projects:read",
  "projects:write",
  "projects:delete",
  "tax:read"
].join(" ")

const BANK_IDS = {
  ALL: "all",
  LEGACY: "legacy",
  TEST: "test",
  MONZO: "fa37a6ecc38eea38bdf3dd0fdcb68fab",
  LLOYDS: "ec6c9a9d1c152056ea6a018b37a56daf",
  LLOYDS_BUSINESS: "4ec5d5e4344f1a5659633815291d8c55",
  DAG_BANK_TEST: "1b3cd579899b5f5b666c15561a48c8b6",
  DAG_INVESTMENT_TEST: "06995ed5c6c6f25e323b34dc45968426",
  MONEYHUB_OPEN_BANKING_TEST: "1ffe704d39629a929c8e293880fb449a",
  OZONE: "5233db2a04fe41dd01d3308ea92e8bd7",
}
const DEFAULT_BANK_ID = BANK_IDS.MONEYHUB_OPEN_BANKING_TEST

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
