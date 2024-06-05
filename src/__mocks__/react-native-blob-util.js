jest.mock('react-native-blob-util', () => {
  return {
    Share: () => ({
      DocumentDir: jest.fn().mockImplementation(() => Promise.resolve()),
    }),
  };
});
