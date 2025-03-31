import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3';

export function useUpdateLanguage() {
  const updateLanguage = (languageCode: string) => {
    return PassioSDK.updateLanguage(languageCode);
  };
  return {
    updateLanguage,
  };
}
