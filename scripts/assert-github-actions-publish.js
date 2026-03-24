#!/usr/bin/env node
// prepublishOnly guard; emergency bypass: npm publish --ignore-scripts
if (process.env.GITHUB_ACTIONS !== "true") {
  console.error(
    "Publishing this package is restricted to GitHub Actions. " +
      "Create a GitHub Release to trigger the publish workflow. " +
      "For a documented emergency bypass, use npm publish --ignore-scripts."
  );
  process.exit(1);
}
