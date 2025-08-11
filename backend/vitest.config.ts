import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      reporter: ["text", "lcov"],
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90
    }
  }
});