/* eslint-disable max-nested-callbacks */
const Moneyhub = require("..")
const config = require("../../test/test-client-config")
const {expect} = require("chai")
const fs = require("fs")
const path = require("path")

const userId = config.testUserId

describe("Transaction Files", () => {
  let moneyhub
  let transactionId
  let fileId
  before(async () => {
    moneyhub = await Moneyhub(config)
    const {data: transactions} = await moneyhub.getTransactions({
      userId,
      params: {limit: 1},
    })

    transactionId = transactions[0].id
  })

  it("add a transaction file", async () => {
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
  })

  it("gets transaction files", async () => {
    const {data: files} = await moneyhub.getTransactionFiles({userId, transactionId})
    expect(files.length).to.be.greaterThan(0)
    expect(files[0].fileName).to.be.a("string")
  })

  it("gets a transaction file", async () => {
    const {data: file} = await moneyhub.getTransactionFile({userId, transactionId, fileId})
    expect(file.fileName).to.be.a("string")
    expect(file.id).to.eql(fileId)
  })

  it("deletes a transaction file", async () => {
    const status = await moneyhub.deleteTransactionFile({userId, transactionId, fileId})
    expect(status).to.eql(204)
  })
})
