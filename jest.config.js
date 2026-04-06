/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  moduleFileExtensions: ["ts", "js", "json"],
  setupFiles: ["<rootDir>/tests/setup-env.ts"],
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/server.ts", "!src/docs/**"],
};
