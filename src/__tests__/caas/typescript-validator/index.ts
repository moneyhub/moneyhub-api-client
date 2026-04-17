import fs from "fs"
import path from "path"
import {expect} from "chai"
import {createGenerator} from "ts-json-schema-generator"

import type {Schema} from "./resolvers"
import {findSchemaErrors} from "./checks"
import {preprocessSchema} from "../swagger"

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

  if (!fs.existsSync(resolvedPath)) {
    expect.fail(`tsFile not found: ${resolvedPath} (resolved from "${tsFile}")`)
  }

  const tsSchema = createTypeSchema(tsType, resolvedPath)
  const rawDef = spec.definitions?.[swaggerDefinitionName]
  expect(rawDef, `${swaggerDefinitionName} not found in swagger definitions`).to.exist

  const swaggerDefinitions = Object.fromEntries(
    Object.entries(spec.definitions ?? {}).map(([key, val]) => [key, preprocessSchema(val)]),
  ) as Schema

  const errors = findSchemaErrors({
    tsSchema,
    swaggerSchema: preprocessSchema(rawDef) as Schema,
    swaggerDefinitions,
  })

  if (errors.length) {
    expect.fail(`${tsType} does not match swagger ${swaggerDefinitionName}:\n${errors.join("\n")}`)
  }
}
