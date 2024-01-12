module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  bail: true,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleNameMapper: {
    '<rootDir>/src/(.*)': '<rootDir>/src/$1'
  },
  testTimeout: 20000
};
