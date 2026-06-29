/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."

import {
  fetchOpenApiSpec,
  createResponseValidator,
  assertMatchesOpenApi,
} from "./openapi"
import {assertTypeMatchesOpenApi} from "./typescript-validator"

const TYPES_FILE = "../../../requests/caas/types/categories.ts"

describe("GET /category-groups", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("fetches category groups and validates against OpenAPI schema", function() {
    this.timeout(30000)

    let response: Awaited<ReturnType<typeof moneyhub.caasGetCategoryGroups>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {

      response = await moneyhub.caasGetCategoryGroups()

      const spec = await fetchOpenApiSpec(this.config.caas.openapiUrl)
      const resValidator = createResponseValidator(spec, "/category-groups", "get", "200")
      if (!resValidator) throw new Error("OpenAPI schema missing for GET /category-groups")
      validateResponse = resValidator
    })

    it("response matches OpenAPI 200 schema", function() {
      assertMatchesOpenApi(validateResponse, response, "Response")
    })

    it("response contains at least the known catalogue of category groups", function() {
      expect(response.data).to.be.an("array").with.length.of.at.least(16)
    })

    it("category groups have the expected shape", function() {
      const first = response.data[0]

      expect(first).to.have.property("l1CategoryGroupId")
      expect(first).to.have.property("l1CategoryGroupName")
      expect(first).to.have.property("l1CategoryType")
    })

    it("includes a representative sample of category group names", function() {
      const names = response.data.map((g) => g.l1CategoryGroupName)

      expect(names).to.include.members([
        "bills",
        "entertainment",
        "household",
        "income",
        "transport",
        "shopping",
      ])
    })
  })

  describe("TypeScript types match OpenAPI schemas", function() {
    this.timeout(30000)

    let spec: Awaited<ReturnType<typeof fetchOpenApiSpec>>

    before(async function() {
      spec = await fetchOpenApiSpec(this.config.caas.openapiUrl)
    })

    it("CaasCategoryGroup matches OpenAPI CategoryGroup definition", function() {
      assertTypeMatchesOpenApi({tsType: "CaasCategoryGroup", tsFile: TYPES_FILE, openApiSchemaName: "CategoryGroupResponse", spec})
    })
  })
})
