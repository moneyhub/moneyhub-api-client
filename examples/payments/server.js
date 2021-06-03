/* eslint-disable max-statements*/
const express = require("express")
const bodyParser = require("body-parser")
const Moneyhub = require("../../src")
const config = require("../config")
const {DEFAULT_STATE, DEFAULT_NONCE} = require("../constants")

// API CLIENT SHOULD HAVE THE REDIRECT URL SET TO:
// 'http://localhost:3001/auth/callback'

const getBanks = async moneyhub => {
  const banks = await moneyhub.listAPIConnections()
  const testBanks = await moneyhub.listTestConnections()
  return banks.concat(testBanks)
}

const start = async () => {
  const moneyhub = await Moneyhub(config)
  const banks = await getBanks(moneyhub)

  const app = express()

  app.get("/keys", (req, res) => res.json(moneyhub.keys()))

  app.get("/payees", async (req, res) => {
    const {data: payees} = await moneyhub.getPayees()
    res.send(`
    <h3>Payees</h3>
  <ul>
  ${payees
    .map(
      ({id, sortCode, accountNumber, name}) =>
        `<li><a href="/pay/${id}">Make payment to: ${name} (${accountNumber}:${sortCode})</a></li>`
    )
    .join("")}
    <li><a href="/add-payee">Add new payee</a></li>
  </ul>
  `)
  })

  app.get("/pay/:payeeId/:bankId", async (req, res) => {
    res.send(`
      <html>
      <body>
      <h4>Send payment</h4>
      <form method="POST" action="/pay/${req.params.payeeId}/${req.params.bankId}">
        <input type="text" minlength="1" maxlength="100" required name="amount" value="100" /><br />
        <input type="text" maxlength="200" required name="payeeRef" value="Payee ref 123" /><br />
        <input type="text" maxlength="200" required name="payerRef" value="Payer ref 456" /><br />
        <button type="submit">Submit payment</button>
      </form>
  `)
  })

  app.post(
    "/pay/:payeeId/:bankId",
    bodyParser.urlencoded({extended: false}),
    bodyParser.json(),
    async (req, res) => {
      const {amount, payeeRef, payerRef} = req.body
      const {bankId, payeeId} = req.params
      try {
        const url = await moneyhub.getPaymentAuthorizeUrl({
          bankId,
          payeeId,
          amount: parseInt(amount, 10),
          payeeRef,
          payerRef,
          state: DEFAULT_STATE,
          nonce: DEFAULT_NONCE,
        })
        res.redirect(url)
      } catch (e) {
        res.send(e)
      }
    }
  )

  app.get("/add-payee", (req, res) =>
    res.send(`
  <html>
  <body>
  <h4>Create a payee</h4>
  <form method="POST" action="/payee">
    <input type="text" maxlength="200" required name="name" placeholder="Name" /><br />
    <input pattern="[0-9]{8,8}" type="text" minlength="8" maxlength="8" required name="accountNumber" placeholder="Account Number" /><br />
    <input type="text" minlength="6" maxlength="6" required name="sortCode" placeholder="Sort Code" /><br />
    <button type="submit">Create Payee</button>
  </form>
  `)
  )

  app.post(
    "/payee",
    bodyParser.urlencoded({extended: false}),
    async (req, res) => {
      await moneyhub.addPayee(req.body)
      res.redirect("/payees")
    }
  )

  app.get("/pay/:payeeId", (req, res) => {
    res.send(`
  <ul>
  ${banks
    // .filter(bank => bank.payments)
    .map(
      ({id, name}) =>
        `<li><a href="/pay/${req.params.payeeId}/${id}">Pay with ${name}</a></li>`
    )
    .join("")}
  </ul>
  `)
  })

  app.get("/", (req, res) =>
    res.send(`
  <h4>Moneyhub API Test Server</h4>
  <a href="/data">Connect to a bank to retrieve balance data</a><br />
  <a href="/payees">Add a payee and initiate a payment</a><br />
  <a href="/payments">View payments made</a>
  `)
  )

  app.get("/payments", async (req, res) => {
    const data = await moneyhub.getPayments()
    res.json(data)
  })

  app.get("/data", (req, res) =>
    res.send(`
  <ul>
  ${banks
    .map(({id, name}) => `<li><a href="/data/${id}">${name}</a></li>`)
    .join("")}
  </ul>
  `)
  )

  app.get("/data/:id", async (req, res) => {
    const url = await moneyhub.getAuthorizeUrl({
      state: DEFAULT_STATE,
      scope: `openid offline_access id:${req.params.id} accounts:read transactions:read:all`,
    })
    res.send(`<a href=${url}>Click me</a>`)
  })

  app.get("/auth/callback", async (req, res) => {
    const queryParams = req.query
    const {error, code, state, id_token, idToken} = queryParams

    console.log("Query params", JSON.stringify(queryParams, null, 2))
    if (error) {
      return res.json(queryParams)
    }

    const paramsFromCallback = {
      code,
      state,
      id_token: idToken || id_token,
    }
    const localParams = {
      nonce: DEFAULT_NONCE,
      state,
    }

    const tokens = await moneyhub.exchangeCodeForTokens({
      paramsFromCallback,
      localParams,
    })
    return res.json({tokens, claims: tokens.claims})
  })

  app.listen(3001, () => console.log("Test Server started on port 3001"))
}

start()
