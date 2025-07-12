module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx' ],
    setupFilesAfterEnv: [ '<rootDir>/src/setupTests.ts' ],
    transform: {
        '^.+\\.(ts|tsx)$': [ 'ts-jest', { tsconfig: '<rootDir>/tsconfig.json' } ],
        '^.+\\.(js|jsx)$': [ 'babel-jest', {
            presets: [
                [ '@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' } ],
                '@babel/preset-react',
                '@babel/preset-typescript'
            ],
            plugins: [ '@babel/plugin-transform-runtime' ]
        } ],
    },
    transformIgnorePatterns: [
        '/node_modules/(?!axios)/' // Ensure axios can be transformed as fallback
    ],
};