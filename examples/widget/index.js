const express = require("express")
const bodyParser = require("body-parser")
const Moneyhub = require("../../src")

const config = require("../config")
const LOCAL_IDENTITY_URL = "http://identity.dev.127.0.0.1.nip.io/oidc"
const LOCAL_ACCOUNT_CONNECT_URL = "http://localhost:8080/account-connect.js" // Bank chooser
const LOCAL_REDIRECT_URI = "http://localhost:3001"

// Make sure to set 'http://localhost:3001' as redirect_uri for your API client
// if you want the code exchange to be managed automatically

// Run node examples/widget/index.js

// Go to
//       http://localhost:3001?userId=your-user-id

const DEFAULT_USER_ID = "5c82710d7c2eb82b175c2c5c"

const run = async () => {
  const {
    identityServiceUrl = LOCAL_IDENTITY_URL,
    accountConnectUrl = LOCAL_ACCOUNT_CONNECT_URL,
    client: {
      client_id: clientId,
      redirect_uri = LOCAL_REDIRECT_URI,
    },
  } = config
  const moneyhub = await Moneyhub(config)
  const app = express()
  const [identityUrl] = identityServiceUrl.split("/oidc")

  app.get("/", (req, res) => {
    const {userId = DEFAULT_USER_ID} = req.query || {}

    res.send(`
    <html>
    <body>
    <h3>Example page</h3>
    <p>Widget should appear below here:</p>
    <script
    data-clientid="${clientId}"
    data-redirecturi="${redirect_uri}"
    data-userid="${userId}"
    data-posturi="/result"
    data-finishuri="/finish"
    data-type="test"
    data-identityuri="${identityUrl}"
    src="${accountConnectUrl}"></script>

    `)
  })

  app.get("/finish", (req, res) => {
    res.send(`
      <h3>Finish</h3>
      <a href="/">Start again</a>
    `)
  })

  app.post("/result", bodyParser.json(), async (req, res) => {
    const data = req.body
    console.log(data)
    const tokens = await moneyhub.exchangeCodeForTokens(data)
    console.log(tokens)
    res.send("OK")
  })

  app.listen(3001, () => console.log("Example widget server listening on 3001"))
}

run()
