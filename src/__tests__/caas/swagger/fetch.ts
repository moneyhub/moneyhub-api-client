import got from "got"

type Schema = Record<string, any>

const specCache = new Map<string, Schema>()

export async function fetchSwaggerSpec(url: string): Promise<Schema> {
  const cached = specCache.get(url)
  if (cached) return cached
  const {body} = await got(url, {responseType: "json"})
  const spec = body as Schema
  specCache.set(url, spec)
  return spec
}
