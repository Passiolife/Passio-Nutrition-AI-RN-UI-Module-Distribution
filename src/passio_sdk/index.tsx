import {
  type ConfigurationOptions,
  PassioSDK,
  type PassioStatus,
} from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { useEffect, useState } from 'react';

export const usePassioSDK = (options: ConfigurationOptions): PassioStatus => {
  // Default value of PassioStatus was SDKNotReady
  const [passioStatus, setPassioStatus] = useState<PassioStatus>({
    mode: 'notReady',
    missingFiles: [],
  });

  useEffect(() => {
    async function configure() {
      const status = await PassioSDK.configure(options);
      setPassioStatus(status);
    }
    configure();
  }, [options]);

  return passioStatus;
};
