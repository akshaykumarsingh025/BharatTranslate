module.exports = {
    openDatabaseSync: () => ({
        execSync: jest.fn(),
        getFirstSync: jest.fn(),
        getAllSync: jest.fn(),
        runSync: jest.fn(),
    }),
};
