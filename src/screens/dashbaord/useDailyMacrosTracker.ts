import { useServices } from '../../contexts';
import { resourceCache, useAsyncResource } from 'use-async-resource';
import { getDailyMacrosProgress } from '../../utils/DataServiceHelper';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';

export function useDailyMacrosTracker(startDate: Date, endDate: Date) {
  const services = useServices();
  const isFocused = useIsFocused();

  const [nutritionTracker] = useAsyncResource(
    getDailyMacrosProgress,
    startDate,
    endDate,
    services
  );
  const dailyTracker = nutritionTracker();

  useEffect(() => {
    resourceCache(getDailyMacrosProgress).clear();
  }, [isFocused]);

  return {
    dailyTracker,
  };
}
