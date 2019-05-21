const express = require("express")
const Moneyhub = require("../../src")

const config = require("../config")
const port = 3001
// Example callback server that handles exchanging the authorization code on a callback

// Make sure to set 'http://localhost:3001' as redirect_uri for your API client

const run = async () => {
  const moneyhub = await Moneyhub(config)
  const app = express()

  app.get("/", async (req, res) => {
    const data = req.query
    console.log(JSON.stringify(data, null, 2))
    const result = await moneyhub.exchangeCodeForTokens(data)
    console.log(result)
    res.send(`
      ${JSON.stringify(result, null, 2)}
    `)
  })
  app.listen(port, () => console.log(`Example callback server listening on ${port}`))
}

run()
