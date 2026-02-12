"use strict";
const {baseConfigWithFiles} = require("@mft/eslint-config-momentumft/typescript")
const {base, testsWithFiles} = require("@mft/eslint-config-momentumft")

module.exports = [
  ...base,
  ...baseConfigWithFiles,
  testsWithFiles,
]
