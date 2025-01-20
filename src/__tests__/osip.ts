/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {expectTypeOf} from "expect-type"
import {OsipAccount, OsipHolding, OsipTransaction} from "src/schema/osip"

import {Moneyhub, MoneyhubInstance} from ".."

describe("Osip", function() {
  let accountId: string,
    moneyhub: MoneyhubInstance,
    pensionId: string,
    readOnlyUserId: string,
    userId: string

  before(async function() {
    const {
      testUserId,
      testPensionAccountId,
      readOnlyPensionId,
      testReadOnlyUserId,
    } = this.config
    userId = testUserId
    readOnlyUserId = testReadOnlyUserId
    accountId = testPensionAccountId
    pensionId = readOnlyPensionId

    moneyhub = await Moneyhub(this.config)
  })

  it("get osip accounts", async function() {
    const accounts = await moneyhub.getOsipAccounts({userId})
    expect(accounts.data.length).to.be.at.least(1)
    expectTypeOf<OsipAccount[]>(accounts.data)
  })

  it("get account", async function() {
    const {data: account} = await moneyhub.getOsipAccount({userId, accountId})
    expect(account.id).to.eql(accountId)
    expectTypeOf<OsipAccount>(account)
  })

  it("get holdings", async function() {
    const {data: holdings} = await moneyhub.getOsipAccountHoldings({
      userId: readOnlyUserId,
      accountId: pensionId,
    })
    expect(holdings).to.be.an("array")
    expect(holdings).to.be.empty
    if (holdings.length > 0) {
      expect(holdings[0].product.type).to.eql("ISIN")
      expectTypeOf<OsipHolding[]>(holdings)
    }
  })

  it("get osip transactions", async function() {
    const {data: trxs} = await moneyhub.getOsipAccountTransactions({
      userId,
      accountId,
    })
    // Will be 0 for now until we can develop a better way to generate these
    expect(trxs.length).to.eql(0)
    expectTypeOf<OsipTransaction[]>(trxs)
  })
})
