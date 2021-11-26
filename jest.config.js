// jest.config.js
const tsPreset = require('ts-jest/jest-preset');

const ignorePatterns = ['<rootDir>/node_modules', '<rootDir>/dist'];

const optionOverrides = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ignorePatterns,
  coveragePathIgnorePatterns: ignorePatterns,
};

module.exports = { ...tsPreset, ...optionOverrides };
