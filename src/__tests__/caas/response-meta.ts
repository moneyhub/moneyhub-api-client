import {
  fetchOpenApiSpec,
} from "./openapi"
import {assertTypeMatchesOpenApi} from "./typescript-validator"

const TYPES_FILE = "../../../requests/caas/types/response-meta.ts"

describe("CaaS response meta types match OpenAPI schemas", function() {
  this.timeout(30000)

  let spec: Awaited<ReturnType<typeof fetchOpenApiSpec>>

  before(async function() {
    if (this.skipOpenApiTests) {
      this.skip()
    }

    spec = await fetchOpenApiSpec(this.config.caas.openapiUrl)
  })

  it("CaasResponseMeta matches OpenAPI ResponseMeta definition", function() {
    assertTypeMatchesOpenApi({
      tsType: "CaasResponseMeta",
      tsFile: TYPES_FILE,
      openApiSchemaName: "ResponseMeta",
      spec,
    })
  })

  it("CaasTransactionsEnrichResponseMeta matches OpenAPI TransactionsEnrichResponseMeta definition", function() {
    assertTypeMatchesOpenApi({
      tsType: "CaasTransactionsEnrichResponseMeta",
      tsFile: TYPES_FILE,
      openApiSchemaName: "TransactionsEnrichResponseMeta",
      spec,
    })
  })
})
