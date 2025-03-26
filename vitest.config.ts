import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Match only unit test patterns
    include: ['tests/unit/**/*.test.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',
      '**/tests-examples/**'
    ],
    
    // Configure coverage collection
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'dist/',
        'e2e/',
        'tests-examples/',
        '**/*.d.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    },

    // Add setup files for extending matchers
    setupFiles: ['./vitest-setup.ts'],
    
    // Environment configuration
    environment: 'node',
    globals: true,
    
    // Test timeout
    testTimeout: 10000
  }
}) 