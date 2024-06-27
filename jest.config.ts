import type { Config } from "jest";

const COVERAGE_THRESHOLD = 85;

const swcrc = {
  jsc: {
    experimental: {
      plugins: [["jest_workaround", {}]],
    },
  },
};

const config: Config = {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest", swcrc],
  },
  reporters: [
    ["summary", { summaryThreshold: 1 }],
  ],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/test.[t]s?(x)", "**/?(*.)+(spec|test).[t]s?(x)"],
  transformIgnorePatterns: ["node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"],
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.ts",
    "!src/app.ts",
    "!src/routes/**",
    "!**/*.routes.ts",
    "!src/modules/*/index.ts",
    "!**/node_modules/**",
    "!**/__tests__/**",
    "!**/scripts/**",
    "!**/dist/**",
    "!**/coverage/**",
    "!jest.config.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text", "cobertura", "lcov"],
  setupFiles: ["<rootDir>/__tests__/setEnvVars.js"],
  coverageThreshold: {
    global: {
      branches: COVERAGE_THRESHOLD,
      functions: COVERAGE_THRESHOLD,
      lines: COVERAGE_THRESHOLD,
      statements: COVERAGE_THRESHOLD,
    },
    "./src/**/*.ts": {
      branches: 50,
      functions: 50,
      lines: COVERAGE_THRESHOLD,
      statements: 75,
    },
  },
};

export default config;
