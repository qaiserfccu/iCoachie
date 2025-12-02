/**
 * Jest configuration for unit tests only
 * These tests don't require database access
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/utils', '<rootDir>/tests/middleware', '<rootDir>/tests/services'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/utils/**/*.ts',
    'src/middleware/**/*.ts',
    'src/services/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage/unit',
  coverageReporters: ['text', 'lcov', 'html'],
  // Unit tests can run in parallel since they don't access the database
  maxWorkers: 4,
};
