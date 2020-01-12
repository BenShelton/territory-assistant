module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFiles: [
    '<rootDir>/tests/unit/setup.ts'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^UnitTest/(.*)$': '<rootDir>/tests/unit/$1',
    '\\.(css|sass|scss)$': 'identity-obj-proxy'
  }
}
