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

describe("GET /categories", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("fetches categories and validates against swagger schema", function() {
    this.timeout(30000)

    let response: Awaited<ReturnType<typeof moneyhub.caasGetCategories>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipSwaggerTests) {
        this.skip()
      }

      response = await moneyhub.caasGetCategories()

      const spec = await fetchSwaggerSpec(this.config.caas.swaggerUrl)
      const resValidator = createResponseValidator(spec, "/categories", "get", "200")
      if (!resValidator) throw new Error("Swagger schema missing for GET /categories")
      validateResponse = resValidator
    })

    it("response matches swagger 200 schema", function() {
      assertMatchesSwagger(validateResponse, response, "Response")
    })

    it("response contains at least the known catalogue of categories", function() {
      expect(response.data).to.be.an("array").with.length.of.at.least(65)
    })

    it("categories have the expected shape", function() {
      const first = response.data[0]

      expect(first).to.have.property("l2CategoryId")
      expect(first).to.have.property("l2CategoryName")
      expect(first).to.have.property("l1CategoryGroupId")
      expect(first).to.have.property("l1CategoryGroupName")
    })

    it("includes a representative sample of category names", function() {
      const names = response.data.map((c) => c.l2CategoryName)

      expect(names).to.include.members([
        "automotive",
        "insurance",
        "travel",
        "savings",
        "pets",
        "eating-out",
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

    it("CaasCategory matches swagger Category definition", function() {
      assertTypeMatchesSwagger({tsType: "CaasCategory", tsFile: TYPES_FILE, swaggerDefinitionName: "Category", spec})
    })
  })
})
