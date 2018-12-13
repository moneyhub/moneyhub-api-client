const express = require("express")
const bodyParser = require("body-parser")
const Moneyhub = require("../../src")
const config = require("../config")

const start = async () => {
  const moneyhub = await Moneyhub(config)
  const banks = await moneyhub.listAPIConnections()
  const app = express()

  app.get("/keys", (req, res) => res.json(moneyhub.keys()))

  app.get("/payees", async (req, res) => {
    const payees = await moneyhub.getPayees()
    res.send(`
    <h3>Payees</h3>
  <ul>
  ${payees
    .map(
      ({id, sortCode, accountNumber}) =>
        `<li><a href="/pay/${id}">Make payment to: ${accountNumber}:${sortCode}</a></li>`
    )
    .join("")}
    <li><a href="/add-payee">Add new payee</a></li>
  </ul>
  `)
  })

  app.get("/pay/:payeeId/:bankId", async (req, res) => {
    const scope = `payment openid id:${req.params.bankId}`
    const claims = {
      id_token: {
        "mh:payment": {
          essential: true,
          value: {
            amount: 100,
            payeeRef: "payee ref 123",
            payerRef: "payer ref 546",
            payeeId: req.params.payeeId,
          },
        },
      },
    }
    try {
      const request = await moneyhub.requestObject(scope, "foobar", claims)
      const uri = await moneyhub.getRequestUri(request)
      const redirect = await moneyhub.getAuthorizeUrlFromRequestUri({
        request_uri: uri,
        scope,
      })
      res.redirect(redirect)
    } catch (e) {
      res.send(e)
    }
  })

  app.get("/add-payee", (req, res) =>
    res.send(`
  <html>
  <body>
  <h4>Create a payee</h4>
  <form method="POST" action="/payee">
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
    .map(
      ({id, name}) =>
        `<li><a href="/pay/${
          req.params.payeeId
        }/${id}">Pay with ${name}</a></li>`
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
    const payments = await moneyhub.getPayments()
    res.json(payments)
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
      state: "foobar",
      scope: `openid offline_access id:${
        req.params.id
      } accounts:read transactions:read:all`,
    })
    res.send(`<a href=${url}>Click me</a>`)
  })

  app.get("/auth/callback", async (req, res) => {
    console.log("got code", req.query.code)
    const tokens = await moneyhub.exchangeCodeForTokens({
      state: "foobar",
      code: req.query.code,
    })
    res.json(tokens)
  })

  app.listen(3001, () => console.log("Test Server started on port 3001"))
}

start()
