import type { Config } from "@jest/types";

const setup: Config.InitialOptions = {
  collectCoverage: true,
  collectCoverageFrom: ["**/*.{ts,tsx}"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "jest.config.ts",
    "index.ts",
  ],
  coverageThreshold: {
    global: {
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.{ts,tsx}"],
  testTimeout: 10000,
};

export default setup;
