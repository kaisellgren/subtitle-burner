export default {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testEnvironment: '<rootDir>/src/test/dsl/jest-environment.ts',
  globalTeardown: '<rootDir>/src/test/dsl/teardown.ts',
  testMatch: ['**/*.test.(ts|tsx)'],
}
