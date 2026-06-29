/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {randomUUID} from "crypto"

import {Moneyhub, MoneyhubInstance} from "../.."
import {
  fetchOpenApiSpec,
  createRequestValidator,
  createResponseValidator,
  assertMatchesOpenApi,
} from "./openapi"

const LIST_PATH = "/users/{userId}/custom-categories"
const DELETE_PATH = "/users/{userId}/custom-categories/{categoryId}"

const uniqueName = () => `test-cat-${randomUUID()}`

describe("/users/{userId}/custom-categories", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("POST /users/{userId}/custom-categories", function() {
    this.timeout(30000)

    let response: Awaited<ReturnType<typeof moneyhub.caasCreateCustomCategory>>
    let requestBody: {customCategoryName: string}
    let validateRequest: NonNullable<ReturnType<typeof createRequestValidator>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipTestsRequiringCaasIds || this.skipOpenApiTests) {
        this.skip()
      }

      const {caas: {userId}} = this.config

      requestBody = {customCategoryName: uniqueName()}

      response = await moneyhub.caasCreateCustomCategory({
        userId,
        customCategoryName: requestBody.customCategoryName,
      })

      const spec = await fetchOpenApiSpec(this.config.caas.openapiUrl)
      const reqValidator = createRequestValidator(spec, LIST_PATH, "post")
      const resValidator = createResponseValidator(spec, LIST_PATH, "post", "201")
      if (!reqValidator || !resValidator) {
        throw new Error(`OpenAPI schema missing for POST ${LIST_PATH}`)
      }
      validateRequest = reqValidator
      validateResponse = resValidator
    })

    after(async function() {
      if (this.skipTestsRequiringCaasIds || !response) {
        return
      }

      const {caas: {userId}} = this.config
      await moneyhub.caasDeleteCustomCategory({
        userId,
        categoryId: response.data.customCategoryId,
      })
    })

    it("request payload matches OpenAPI CustomCategoryPost schema", function() {
      assertMatchesOpenApi(validateRequest, requestBody, "Request body")
    })

    it("response matches OpenAPI 201 schema", function() {
      assertMatchesOpenApi(validateResponse, response, "Response")
    })

    it("response contains the created custom category", function() {
      expect(response.data).to.have.property("customCategoryId")
      expect(response.data).to.have.property("customCategoryName", requestBody.customCategoryName)
    })
  })

  describe("GET /users/{userId}/custom-categories", function() {
    this.timeout(30000)

    let response: Awaited<ReturnType<typeof moneyhub.caasGetCustomCategories>>
    let createdCategoryId: string
    let createdName: string
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipTestsRequiringCaasIds || this.skipOpenApiTests) {
        this.skip()
      }

      const {caas: {userId}} = this.config

      createdName = uniqueName()
      const created = await moneyhub.caasCreateCustomCategory({userId, customCategoryName: createdName})
      createdCategoryId = created.data.customCategoryId

      response = await moneyhub.caasGetCustomCategories({userId})

      const spec = await fetchOpenApiSpec(this.config.caas.openapiUrl)
      const resValidator = createResponseValidator(spec, LIST_PATH, "get", "200")
      if (!resValidator) {
        throw new Error(`OpenAPI schema missing for GET ${LIST_PATH}`)
      }
      validateResponse = resValidator
    })

    after(async function() {
      if (this.skipTestsRequiringCaasIds || !createdCategoryId) {
        return
      }

      const {caas: {userId}} = this.config
      await moneyhub.caasDeleteCustomCategory({userId, categoryId: createdCategoryId})
    })

    it("response matches OpenAPI 200 schema", function() {
      assertMatchesOpenApi(validateResponse, response, "Response")
    })

    it("returns the created custom category in the list", function() {
      const match = response.data.find((c) => c.customCategoryId === createdCategoryId)
      expect(match).to.not.equal(undefined)
      expect(match).to.have.property("customCategoryName", createdName)
    })
  })

  describe("DELETE /users/{userId}/custom-categories/{categoryId}", function() {
    this.timeout(30000)

    let deleteStatus: number
    let notFoundError: unknown

    before(async function() {
      if (this.skipTestsRequiringCaasIds || this.skipOpenApiTests) {
        this.skip()
      }

      const {caas: {userId}} = this.config

      const created = await moneyhub.caasCreateCustomCategory({userId, customCategoryName: uniqueName()})
      const {customCategoryId} = created.data

      deleteStatus = await moneyhub.caasDeleteCustomCategory({userId, categoryId: customCategoryId})

      try {
        await moneyhub.caasDeleteCustomCategory({userId, categoryId: customCategoryId})
      } catch (err) {
        notFoundError = err
      }
    })

    it("responds with 204 No Content", function() {
      expect(deleteStatus).to.equal(204)
    })

    it("deleting the same category again responds with 404", function() {
      expect(notFoundError).to.be.an("Error")
      expect((notFoundError as Error).message).to.include("404")
    })
  })

  describe("validates DELETE path exists in OpenAPI", function() {
    this.timeout(30000)

    before(function() {
      if (this.skipOpenApiTests) {
        this.skip()
      }
    })

    it("has a 204 response defined for DELETE", async function() {
      const spec = await fetchOpenApiSpec(this.config.caas.openapiUrl)
      const path = spec.paths?.[DELETE_PATH]
      expect(path, `OpenAPI missing path ${DELETE_PATH}`).to.not.equal(undefined)
      expect(path.delete?.responses).to.have.property("204")
    })
  })
})
