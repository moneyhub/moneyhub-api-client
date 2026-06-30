import {expect} from "chai"

import {
  assertMatchesOpenApi,
  createRequestValidator,
  createResponseValidator,
  getSchemaDefinitions,
} from "./openapi"

const oas3Spec = {
  openapi: "3.0.3",
  paths: {
    "/counterparties": {
      get: {
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data"],
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Counterparty",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/{userId}/custom-categories": {
      post: {
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CustomCategoryPost",
              },
            },
          },
        },
        responses: {
          "201": {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data"],
                  properties: {
                    data: {
                      $ref: "#/components/schemas/CustomCategory",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Counterparty: {
        type: "object",
        required: ["l3CounterpartyId"],
        properties: {
          l3CounterpartyId: {type: "string"},
          l3CounterpartyName: {type: "string", nullable: true},
        },
      },
      CustomCategoryPost: {
        type: "object",
        required: ["customCategoryName"],
        properties: {
          customCategoryName: {type: "string"},
        },
      },
      CustomCategory: {
        type: "object",
        required: ["customCategoryId"],
        properties: {
          customCategoryId: {type: "string"},
        },
      },
    },
  },
}

describe("OpenAPI spec validators", function() {
  it("exposes schema definitions from components.schemas", function() {
    expect(getSchemaDefinitions(oas3Spec)).to.have.property("Counterparty")
  })

  it("creates a response validator from content.application/json.schema", function() {
    const validate = createResponseValidator(oas3Spec, "/counterparties", "get", "200")

    expect(validate).to.exist
    if (!validate) throw new Error("expected response validator")
    assertMatchesOpenApi(validate, {
      data: [{l3CounterpartyId: "abc", l3CounterpartyName: null}],
    }, "Response")
  })

  it("creates request and response validators from requestBody", function() {
    const validateRequest = createRequestValidator(
      oas3Spec,
      "/users/{userId}/custom-categories",
      "post",
    )
    const validateResponse = createResponseValidator(
      oas3Spec,
      "/users/{userId}/custom-categories",
      "post",
      "201",
    )

    expect(validateRequest).to.exist
    expect(validateResponse).to.exist
    if (!validateRequest || !validateResponse) {
      throw new Error("expected request and response validators")
    }

    assertMatchesOpenApi(validateRequest, {customCategoryName: "groceries"}, "Request body")
    assertMatchesOpenApi(validateResponse, {data: {customCategoryId: "cat-1"}}, "Response")
  })

  it("ignores multipleOf constraints that fail on floating point coordinates", function() {
    const spec = {
      ...oas3Spec,
      components: {
        schemas: {
          ...oas3Spec.components.schemas,
          Geotag: {
            type: "object",
            required: ["latitude", "longitude"],
            properties: {
              latitude: {type: "number", multipleOf: 0.000001},
              longitude: {type: "number", multipleOf: 0.000001},
            },
          },
        },
      },
      paths: {
        "/geotags": {
          get: {
            responses: {
              "200": {
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["data"],
                      properties: {
                        data: {
                          type: "array",
                          items: {$ref: "#/components/schemas/Geotag"},
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }

    const validate = createResponseValidator(spec, "/geotags", "get", "200")

    expect(validate).to.exist
    if (!validate) throw new Error("expected response validator")
    assertMatchesOpenApi(validate, {
      data: [{latitude: 51.438276, longitude: -0.809316}],
    }, "Response")
  })
})
