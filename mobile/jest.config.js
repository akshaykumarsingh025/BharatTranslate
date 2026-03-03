module.exports = {
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|expo|@expo|expo-clipboard|expo-speech|expo-image-picker|expo-sqlite|expo-file-system|expo-document-picker)/)',
    ],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__tests__/__mocks__/fileMock.js',
        '^expo-sqlite$': '<rootDir>/src/__tests__/__mocks__/expo-sqlite.js',
    },
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/__mocks__/'],
};
