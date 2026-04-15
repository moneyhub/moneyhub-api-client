export type Schema = Record<string, any>

export function resolveRef(ref: string, definitions: Schema): Schema {
  return definitions[ref.replace("#/definitions/", "")] ?? {}
}

function resolvePart(part: Schema, definitions: Schema): Schema {
  const resolved = part.$ref ? resolveRef(part.$ref, definitions) : part

  return resolved.allOf ? flattenAllOf(resolved, definitions) : resolved
}

function mergeSchemas(a: Schema, b: Schema): Schema {
  return {
    type: "object",
    properties: {...a.properties, ...b.properties},
    required: [...(a.required ?? []), ...(b.required ?? [])],
  }
}

function deduplicateRequired(schema: Schema): Schema {
  const unique = [...new Set(schema.required ?? [])]

  if (unique.length > 0) return {...schema, required: unique}

  const without = {...schema}

  delete without.required

  return without
}

export function flattenAllOf(schema: Schema, definitions: Schema): Schema {
  if (!schema.allOf) return schema

  const fromAllOf = schema.allOf
    .map((part: Schema) => resolvePart(part, definitions))
    .reduce(mergeSchemas, {type: "object", properties: {}, required: []})

  const withOwnProps = mergeSchemas(fromAllOf, {
    properties: schema.properties ?? {},
    required: schema.required ?? [],
  })

  return deduplicateRequired(withOwnProps)
}

export function resolveToObject(schema: Schema, definitions: Schema): Schema {
  if (schema.$ref) {
    return resolveToObject(resolveRef(schema.$ref, definitions), definitions)
  }

  if (schema.type === "array" && schema.items) {
    return resolveToObject(schema.items, definitions)
  }

  if (schema.allOf) {
    return flattenAllOf(schema, definitions)
  }

  return schema
}

export function resolveProp(prop: Schema, definitions: Schema): Schema {
  if (prop.$ref) {
    return resolveRef(prop.$ref, definitions)
  }

  return resolveToObject(prop, definitions)
}


