import path from "path"
import {expect} from "chai"
import {createGenerator} from "ts-json-schema-generator"

import type {Schema} from "./resolvers"
import {findSchemaErrors} from "./checks"

function createTypeSchema(typeName: string, filePath: string): Schema {
  return createGenerator({
    path: filePath,
    tsconfig: path.resolve(__dirname, "../../../../tsconfig.json"),
    type: typeName,
    topRef: false,
    skipTypeCheck: true,
  }).createSchema(typeName) as Schema
}

interface AssertTypeInput {
  tsType: string
  tsFile: string
  swaggerDefinitionName: string
  spec: Schema
}

export function assertTypeMatchesSwagger({tsType, tsFile, swaggerDefinitionName, spec}: AssertTypeInput): void {
  const resolvedPath = path.resolve(__dirname, tsFile)
  const tsSchema = createTypeSchema(tsType, resolvedPath)
  const swaggerDef = spec.definitions?.[swaggerDefinitionName]
  expect(swaggerDef, `${swaggerDefinitionName} not found in swagger definitions`).to.exist

  const errors = findSchemaErrors({
    tsSchema,
    swaggerSchema: swaggerDef,
    swaggerDefinitions: spec.definitions ?? {},
  })

  if (errors.length) {
    expect.fail(`${tsType} does not match swagger ${swaggerDefinitionName}:\n${errors.join("\n")}`)
  }
}
