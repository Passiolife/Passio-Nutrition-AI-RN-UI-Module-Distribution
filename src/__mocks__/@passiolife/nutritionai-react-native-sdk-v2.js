jest.mock('@passiolife/nutritionai-react-native-sdk-v3', () => {
  const mockSDK = {
    getAttributesForPassioID() {
      return require('../../__tests__/assets/json/mock_passio_sdk_attribute.json');
    },
  };
  const mockPassioIcon =
    require('../../__tests__/utils/MockPassioIcon').default;

  return {
    PassioSDK: mockSDK,
    PassioIconView: mockPassioIcon,
    IconSize: 'PX90',
  };
});
