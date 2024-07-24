import { useEffect, useState } from 'react';

import {
  CompletedDownloadingFile,
  DownloadingError,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3';

export function usePassioConfig({ key }: { key: string }) {
  const [isReady, setIsReady] = useState(false);
  const [leftFile, setDownloadingLeft] = useState<number | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function getAuth() {
      const passioSDKStatus = await PassioSDK.configure({
        key: key,
        autoUpdate: true,
        debugMode: true,
      });
      setError(undefined);
      setIsReady(passioSDKStatus.mode === 'isReadyForDetection');
      if (passioSDKStatus.mode === 'error') {
        setError(passioSDKStatus.errorMessage);
      }
    }

    getAuth();
  }, [key]);

  const requestCameraAuthorization = () => {
    return PassioSDK.requestCameraAuthorization();
  };

  useEffect(() => {
    const callBacks = PassioSDK.onDownloadingPassioModelCallBacks({
      completedDownloadingFile: ({ filesLeft }: CompletedDownloadingFile) => {
        setDownloadingLeft(filesLeft);
      },
      downloadingError: ({ message }: DownloadingError) => {
        setDownloadError(message);
      },
    });
    return () => callBacks.remove();
  }, []);

  return {
    isReady,
    leftFile,
    downloadError,
    error,
    requestCameraAuthorization,
  };
}
