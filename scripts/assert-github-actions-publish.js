#!/usr/bin/env node
// prepublishOnly guard; emergency bypass: npm publish --ignore-scripts
const allowedRepo = "moneyhub/moneyhub-api-client";

if (process.env.GITHUB_ACTIONS !== "true") {
  console.error(
    "Publishing this package is restricted to GitHub Actions. " +
      "Create a GitHub Release on moneyhub/moneyhub-api-client to trigger the publish workflow. " +
      "For a documented emergency bypass, use npm publish --ignore-scripts."
  );
  process.exit(1);
}

if (process.env.GITHUB_REPOSITORY !== allowedRepo) {
  console.error(
    `Publishing this package is restricted to ${allowedRepo}. ` +
      `Current repository: ${process.env.GITHUB_REPOSITORY || "(unset)"}.`
  );
  process.exit(1);
}
