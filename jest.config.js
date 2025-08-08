/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // si tu veux utiliser les imports absolus avec @/...
  moduleNameMapper: {
    // capture tout ce qui suit "@/..." et le redirige vers "<rootDir>/src/..."
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // (optionnel) si tu utilises aussi baseUrl:"src" dans tsconfig.json
  modulePaths: ['<rootDir>/src'],
}
