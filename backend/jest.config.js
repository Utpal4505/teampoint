/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    experimentalVmModules: true,
  },

  extensionsToTreatAsEsm: ['.ts'],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  moduleDirectories: ['node_modules'],

  testMatch: ['**/tests/**/*.test.ts'],

  clearMocks: true,
  resetMocks: true,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'esnext',
          isolatedModules: true,
        },
      },
    ],
  },

  unmockedModulePathPatterns: [],

  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
}
