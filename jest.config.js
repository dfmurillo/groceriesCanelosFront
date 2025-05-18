const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testPathIgnorePatterns: ['<rootDir>/e2e'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^env.mjs$': '<rootDir>/env.mjs',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}

module.exports = createJestConfig(customJestConfig)
