/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."

import {
  fetchSwaggerSpec,
  createResponseValidator,
  assertMatchesSwagger,
} from "./swagger"
import {assertTypeMatchesSwagger} from "./typescript-validator"

const TYPES_FILE = "../../../requests/caas/types/categories.ts"

describe("GET /category-groups", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("fetches category groups and validates against swagger schema", function() {
    this.timeout(30000)

    let response: Awaited<ReturnType<typeof moneyhub.caasGetCategoryGroups>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipSwaggerTests) {
        this.skip()
      }

      response = await moneyhub.caasGetCategoryGroups()

      const spec = await fetchSwaggerSpec(this.config.caas.swaggerUrl)
      const resValidator = createResponseValidator(spec, "/category-groups", "get", "200")
      if (!resValidator) throw new Error("Swagger schema missing for GET /category-groups")
      validateResponse = resValidator
    })

    it("response matches swagger 200 schema", function() {
      assertMatchesSwagger(validateResponse, response, "Response")
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

  describe("TypeScript types match swagger definitions", function() {
    this.timeout(30000)

    let spec: Awaited<ReturnType<typeof fetchSwaggerSpec>>

    before(async function() {
      if (this.skipSwaggerTests) {
        this.skip()
      }
      spec = await fetchSwaggerSpec(this.config.caas.swaggerUrl)
    })

    it("CaasCategoryGroup matches swagger CategoryGroup definition", function() {
      assertTypeMatchesSwagger({tsType: "CaasCategoryGroup", tsFile: TYPES_FILE, swaggerDefinitionName: "CategoryGroup", spec})
    })
  })
})
