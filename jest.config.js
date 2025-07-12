module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testEnvironment: 'jsdom',
    moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx' ],
    setupFilesAfterEnv: [ '<rootDir>/src/setupTests.ts' ], // Optional, see below
};