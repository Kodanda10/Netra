import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['tests/setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    coverage: {
      reporter: ["text", "lcov"],
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90
    }
  },
});