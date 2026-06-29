function getCaasBaseUrl(apiConfig) {
  if (apiConfig.gatewayCaasResourceServerUrl) {
    return apiConfig.gatewayCaasResourceServerUrl
  }

  if (apiConfig.caasResourceServerUrl) {
    return apiConfig.caasResourceServerUrl
  }

  if (apiConfig.resourceServerUrl) {
    return `${apiConfig.resourceServerUrl.replace(/\/v\d+(\.\d+)?\b/, "")}/caas/v1`
  }

  return undefined
}

function deriveOpenApiUrl(caasBaseUrl) {
  const url = new URL(caasBaseUrl)
  url.pathname = `${url.pathname.replace(/\/v\d+\/?$/, "").replace(/\/$/, "")}/openapi.json`
  return url.toString()
}

function resolveOpenApiUrl(apiConfig) {
  if (apiConfig.caas?.openapiUrl) {
    return apiConfig.caas.openapiUrl
  }

  const caasBaseUrl = getCaasBaseUrl(apiConfig)
  if (!caasBaseUrl) {
    return undefined
  }

  return deriveOpenApiUrl(caasBaseUrl)
}

module.exports = {
  deriveOpenApiUrl,
  getCaasBaseUrl,
  resolveOpenApiUrl,
}
