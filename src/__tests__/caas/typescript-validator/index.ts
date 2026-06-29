import fs from "fs"
import path from "path"
import {expect} from "chai"
import {createGenerator} from "ts-json-schema-generator"

import type {Schema} from "./resolvers"
import {findSchemaErrors} from "./checks"
import {getSchemaDefinitions, preprocessSchema} from "../openapi"

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
  openApiSchemaName: string
  spec: Schema
}

export function assertTypeMatchesOpenApi({tsType, tsFile, openApiSchemaName, spec}: AssertTypeInput): void {
  const resolvedPath = path.resolve(__dirname, tsFile)

  if (!fs.existsSync(resolvedPath)) {
    expect.fail(`tsFile not found: ${resolvedPath} (resolved from "${tsFile}")`)
  }

  const tsSchema = createTypeSchema(tsType, resolvedPath)
  const schemaDefinitions = getSchemaDefinitions(spec)
  const rawDef = schemaDefinitions[openApiSchemaName]
  expect(rawDef, `${openApiSchemaName} not found in OpenAPI schemas`).to.exist

  const openApiDefinitions = Object.fromEntries(
    Object.entries(schemaDefinitions).map(([key, val]) => [key, preprocessSchema(val)]),
  ) as Schema

  const errors = findSchemaErrors({
    tsSchema,
    openApiSchema: preprocessSchema(rawDef) as Schema,
    openApiDefinitions,
  })

  if (errors.length) {
    expect.fail(`${tsType} does not match OpenAPI ${openApiSchemaName}:\n${errors.join("\n")}`)
  }
}
