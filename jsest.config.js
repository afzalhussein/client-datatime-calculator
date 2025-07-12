const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx' ],
  setupFilesAfterEnv: [ '<rootDir>/src/setupTests.ts' ], // Optional, see below
  transformIgnorePatterns: [
    "/node_modules/(?!(axios)/)"
  ],
  preset: 'ts-jest',
};