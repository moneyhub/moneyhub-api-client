"use strict"

const express = require("express")
const got = require("got")
const qs = require("querystring")

const IDENTITY_PREFIX = "/moneyhub/identity-service"
const API_PREFIX = "/moneyhub/resource-server"

/** Match leading /v2, /v3, /v2.0, /v3.0 so we can strip it when forwarding to real API (avoids doubling when realResourceServerUrl already includes version). */
const VERSION_PATH_SEGMENT = /^\/v\d+(?:\.\d+)?/

/** True when the base URL already ends with a version segment (e.g. .../v3). */
function baseHasVersionSegment(base) {
  return /\/v\d+(?:\.\d+)?\/?$/.test(base.replace(/\/$/, ""))
}

/**
 * Creates an Express app that proxies gateway-style paths to real backend URLs.
 * - /moneyhub/identity-service/* -> realIdentityServiceUrl + path after prefix (unchanged)
 * - /moneyhub/resource-server/* -> realResourceServerUrl + path after prefix with leading version segment stripped (so realResourceServerUrl may include version, e.g. https://api.moneyhub.co.uk/v3)
 *
 * @param {object} options
 * @param {string} options.realIdentityServiceUrl - e.g. https://identity-dev.moneyhub.co.uk
 * @param {string} options.realResourceServerUrl - e.g. https://api-dev.moneyhub.co.uk or https://api-dev.moneyhub.co.uk/v3
 * @returns {express.Application}
 */
function createProxyApp({realIdentityServiceUrl, realResourceServerUrl}) {
  const identityBase = realIdentityServiceUrl.replace(/\/$/, "")
  const apiBase = realResourceServerUrl.replace(/\/$/, "")

  const app = express()

  app.use(express.json({limit: "10mb"}))
  app.use(express.urlencoded({extended: true}))

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {string} targetBase
   * @param {string | ((req: import("express").Request) => string)} pathPrefix - string or function returning path (used so resource-server can strip /v3 from path to avoid doubling when targetBase already has version)
   */
  const proxy = async (req, res, targetBase, pathPrefix = "") => {
    const pathPart = typeof pathPrefix === "function" ? pathPrefix(req) : (pathPrefix + req.path)
    const targetPath = pathPart || "/"
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
    // Path after mount: Express may give req.path relative to mount (/v3/accounts) or full path
    // depending on version; derive the remainder after API_PREFIX so version stripping works.
    const pathAfterPrefix = req.path.startsWith(API_PREFIX)
      ? req.path.slice(API_PREFIX.length) || "/"
      : req.path
    // Only strip leading version segment when realResourceServerUrl already includes version (e.g. .../v3), to avoid doubling.
    const pathToForward =
      baseHasVersionSegment(apiBase)
        ? (pathAfterPrefix.replace(VERSION_PATH_SEGMENT, "") || "/")
        : pathAfterPrefix
    return proxy(req, res, apiBase, () => pathToForward)
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
