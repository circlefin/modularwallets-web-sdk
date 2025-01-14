export default {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  reporters: ['default', 'jest-junit'],
  cacheDirectory: '.jest',
  clearMocks: true,
  maxWorkers: '25%',
  workerIdleMemoryLimit: '75%',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
