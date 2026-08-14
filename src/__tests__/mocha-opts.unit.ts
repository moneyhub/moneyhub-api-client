import {expect} from "chai"
import {readdirSync, readFileSync} from "fs"
import {join, relative} from "path"

const repoRoot = join(__dirname, "../..")
const optsDir = join(repoRoot, "test/opts")

function loadOpts(name: string): {spec?: string[]; ignore?: string[]} {
  return JSON.parse(readFileSync(join(optsDir, name), "utf8"))
}

// Files matching mocha's integration spec: one .ts segment under any __tests__ directory.
function listIntegrationStyleSpecs(): string[] {
  const results: string[] = []
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, {withFileTypes: true})) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
        continue
      }
      if (!entry.isFile() || !entry.name.endsWith(".ts")) continue
      if (!dir.replace(/\\/g, "/").endsWith("/__tests__")) continue
      results.push(relative(repoRoot, full).replace(/\\/g, "/"))
    }
  }
  walk(join(repoRoot, "src"))
  return results
}

function applyIgnore(files: string[], ignore: string[] = []): string[] {
  const dropUnit = ignore.some((pattern) => pattern.includes(".unit.ts"))
  return dropUnit ? files.filter((f) => !f.endsWith(".unit.ts")) : files
}

describe("mocha opts (unit)", function() {
  it("integration.json does not include *.unit.ts files", function() {
    const opts = loadOpts("integration.json")
    expect(opts.ignore || []).to.include("**/*.unit.ts")
    const files = applyIgnore(listIntegrationStyleSpecs(), opts.ignore)
    const unitFiles = files.filter((f) => f.endsWith(".unit.ts"))
    expect(unitFiles, `unexpected unit files in integration: ${unitFiles.join(", ")}`).to.deep.equal([])
  })

  it("integration-ci.json does not include *.unit.ts files", function() {
    const opts = loadOpts("integration-ci.json")
    expect(opts.ignore || []).to.include("**/*.unit.ts")
    const files = applyIgnore(listIntegrationStyleSpecs(), opts.ignore)
    const unitFiles = files.filter((f) => f.endsWith(".unit.ts"))
    expect(unitFiles, `unexpected unit files in integration-ci: ${unitFiles.join(", ")}`).to.deep.equal([])
  })
})
