import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setupTests.ts'],
    css: true,
    globals: true,
    include: ['tests/**/*.test.tsx', 'tests/**/*.test.ts'],
    exclude: ['backend/**', 'node_modules/**'],
    coverage: {
      reporter: ['text', 'lcov'],
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: ['backend/**', 'tests/**', 'src/main.*', 'src/App.jsx']
    },
  },
})


