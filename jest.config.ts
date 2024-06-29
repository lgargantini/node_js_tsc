import type { Config } from "jest";

const swcrc = {
  jsc: {
    experimental: {
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
  setupFiles: ["<rootDir>/__tests__/setEnvVars.js"],
  collectCoverage: true,
};

export default config;
