/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {expectTypeOf} from "expect-type"
import fs from "fs"
import path from "path"

import {Moneyhub, MoneyhubInstance, Transactions} from ".."

describe("Transaction Files", function() {
  let moneyhub: MoneyhubInstance
  let transactionId: string
  let fileId: string
  let userId: string

  before(async function() {
    userId = this.config.testUserId
    moneyhub = await Moneyhub(this.config)
    const {data: transactions} = await moneyhub.getTransactions({
      userId,
      params: {limit: 1},
    })

    transactionId = transactions[0].id
  })

  it("add a transaction file", async function() {
    const {data: file} = await moneyhub.addFileToTransaction({
      userId,
      transactionId,
      fileData: fs.readFileSync(
        path.join(__dirname, "../../resources/sample.jpg"),
      ),
      fileName: "sample.jpg",
    })

    expect(file.id).to.be.a("string")
    fileId = file.id
    expect(file.fileName).to.eql("sample.jpg")
    expectTypeOf<Transactions.TransactionFile>(file)
  })

  it("gets transaction files", async function() {
    const {data: files} = await moneyhub.getTransactionFiles({userId, transactionId})
    expect(files.length).to.be.greaterThan(0)
    expect(files[0].fileName).to.be.a("string")
    expectTypeOf<Transactions.TransactionFile[]>(files)
  })

  it("gets a transaction file", async function() {
    const {data: file} = await moneyhub.getTransactionFile({userId, transactionId, fileId})
    expect(file.fileName).to.be.a("string")
    expect(file.id).to.eql(fileId)
    expectTypeOf<Transactions.TransactionFile>(file)
  })

  it("deletes a transaction file", async function() {
    const status = await moneyhub.deleteTransactionFile({userId, transactionId, fileId})
    expect(status).to.eql(204)
  })
})
