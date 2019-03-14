const express = require("express")
const bodyParser = require("body-parser")
const Moneyhub = require("../../src")

const config = require("../config")

const run = async () => {
  const moneyhub = await Moneyhub(config)
  const app = express()

  app.get("/", (req, res) => {
    res.send(`
    <html>
    <body>
    <h3>Example page</h3>
    <p>Widget should appear below here:</p>
    <script 
    data-clientid="48a5db5a-b80a-4aa4-9201-41d86add6f01" 
    data-redirecturi="http://localhost:3001" 
    data-userid="5c82710d7c2eb82b175c2c5c" 
    data-posturi="/result" 
    data-finishuri="/finish"
    data-type="test"
    data-identityuri="http://identity.dev.127.0.0.1.nip.io" 
    src="http://localhost:8080/account-connect.js"></script>

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
