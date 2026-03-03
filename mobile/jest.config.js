module.exports = {
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|expo|@expo|expo-clipboard|expo-speech|expo-image-picker)/)',
    ],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__tests__/__mocks__/fileMock.js',
    },
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/__mocks__/'],
};
