"use strict"

const express = require("express")
const got = require("got")
const qs = require("querystring")

const IDENTITY_PREFIX = "/moneyhub/identity-service"
const API_PREFIX = "/moneyhub/resource-server"

/**
 * Creates an Express app that proxies gateway-style paths to real backend URLs.
 * Forwards the path after each prefix through unchanged (no v3 stripping or rewriting).
 * - /moneyhub/identity-service/* -> realIdentityServiceUrl + path after prefix
 * - /moneyhub/resource-server/* -> realResourceServerUrl + path after prefix (e.g. /v3/accounts)
 *
 * @param {object} options
 * @param {string} options.realIdentityServiceUrl - e.g. https://identity-dev.moneyhub.co.uk
 * @param {string} options.realResourceServerUrl - e.g. https://api-dev.moneyhub.co.uk
 * @returns {express.Application}
 */
function createProxyApp({realIdentityServiceUrl, realResourceServerUrl}) {
  const identityBase = realIdentityServiceUrl.replace(/\/$/, "")
  const apiBase = realResourceServerUrl.replace(/\/$/, "")

  const app = express()

  app.use(express.json({limit: "10mb"}))
  app.use(express.urlencoded({extended: true}))

  const proxy = async (req, res, targetBase, pathPrefix = "") => {
    const targetPath = (pathPrefix + req.path) || "/"
    const targetUrl = `${targetBase}${targetPath}${req.url.slice(req.path.length) || ""}`

    const headers = {...req.headers}
    delete headers.host

    const opts = {
      method: req.method,
      headers,
      throwHttpErrors: false,
      timeout: {request: 30000},
    }
    if (req.query && Object.keys(req.query).length) {
      opts.searchParams = req.query
    }
    if (req.body && ["POST", "PUT", "PATCH"].includes(req.method)) {
      const contentType = (req.headers["content-type"] || "").toLowerCase()
      if (contentType.includes("application/x-www-form-urlencoded")) {
        opts.body = typeof req.body === "string" ? req.body : qs.stringify(req.body)
        opts.headers["content-type"] = "application/x-www-form-urlencoded"
      } else {
        opts.json = req.body
      }
    }

    try {
      const response = await got(targetUrl, opts)
      res.status(response.statusCode)
      response.headers && Object.entries(response.headers).forEach(([k, v]) => res.setHeader(k, v))
      res.send(response.rawBody)
    } catch (err) {
      res.status(err.response?.statusCode || 502).send(err.response?.rawBody || err.message)
    }
  }

  app.use(IDENTITY_PREFIX, (req, res) => {
    return proxy(req, res, identityBase, "")
  })

  app.use(API_PREFIX, (req, res) => {
    return proxy(req, res, apiBase, "")
  })

  return app
}

/**
 * Starts the proxy server on a dynamic port.
 * @param {object} options - same as createProxyApp
 * @returns {Promise<{server: import("http").Server, port: number, stop: () => Promise<void>}>}
 */
function startProxyServer(options) {
  return new Promise((resolve, reject) => {
    const app = createProxyApp(options)
    const server = app.listen(0, () => {
      const port = server.address().port
      resolve({
        server,
        port,
        stop: () => new Promise((done) => server.close(done)),
      })
    })
    server.on("error", reject)
  })
}

module.exports = {createProxyApp, startProxyServer}
