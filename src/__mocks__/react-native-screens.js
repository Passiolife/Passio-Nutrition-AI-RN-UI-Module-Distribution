jest.mock('react-native-screens', () => {
  const RealComponent = jest.requireActual('react-native-screens');
  RealComponent.enableScreens = jest.fn();
  return RealComponent;
});
