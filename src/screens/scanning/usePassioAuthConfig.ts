import { useEffect, useState } from 'react';

import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';

export function usePassioAuthConfig({ key }: { key: string }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function getAuth() {
      const isAuthorized = await PassioSDK.requestCameraAuthorization();
      const passioSDKStatus = await PassioSDK.configure({
        key: key,
        autoUpdate: true,
        debugMode: true,
      });

      setIsReady(
        isAuthorized && passioSDKStatus.mode === 'isReadyForDetection'
      );
    }

    getAuth();
  }, [key]);

  return {
    isReady,
  };
}
