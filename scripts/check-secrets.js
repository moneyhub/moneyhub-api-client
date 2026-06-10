#!/usr/bin/env node
const {execSync} = require("child_process")

const blockedPaths = [
  "examples/config.js",
]

const secretPatterns = [
  {
    name: "PEM private key",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
  },
  {
    name: "JWK private component (\"d\")",
    regex: /"d"\s*:\s*"[A-Za-z0-9_-]{20,}"/,
  },
  {
    name: "Real client_secret value",
    regex: /client_secret"?\s*[:=]\s*"(?!your client secret")[^"]{8,}"/,
  },
]

const getStagedFiles = () => {
  const output = execSync(
    "git diff --cached --name-only --diff-filter=ACM",
    {encoding: "utf8"}
  )
  return output.split("\n").map(line => line.trim()).filter(Boolean)
}

const getStagedContent = file => {
  try {
    return execSync(`git show :"${file}"`, {encoding: "utf8"})
  } catch (err) {
    return ""
  }
}

const scanFile = file => {
  const findings = []
  if (blockedPaths.includes(file)) {
    findings.push(`${file}: file is blocked from being committed (use examples/config.example.js as a template and keep secrets in the git-ignored examples/config.js)`)
    return findings
  }
  const content = getStagedContent(file)
  secretPatterns.forEach(({name, regex}) => {
    if (regex.test(content)) {
      findings.push(`${file}: matched "${name}"`)
    }
  })
  return findings
}

const main = () => {
  const files = getStagedFiles()
  const findings = files.flatMap(scanFile)
  if (findings.length === 0) {
    process.exit(0)
  }
  console.error("\nCommit blocked: potential secrets detected in staged changes\n")
  findings.forEach(finding => console.error(`  - ${finding}`))
  console.error("\nRemove the secrets, unstage the file, and commit again.")
  console.error("If this is a false positive, review the staged content before bypassing.\n")
  process.exit(1)
}

main()
