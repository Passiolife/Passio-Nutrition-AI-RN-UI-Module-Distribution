import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useServices } from './contexts';
import { DashboardScreen, MealLogScreenView } from './screens';

export const NutritionApp = () => {
  const services = useServices();
  const [isProfileSet, setIsProfile] = useState<boolean | null>(null);

  useEffect(() => {
    const initData = async () => {
      const profile = await services.dataService.getNutritionProfile();
      setIsProfile(profile !== undefined);
    };
    initData();
  }, [services.dataService]);

  const render = () => {
    return (
      <>
        {isProfileSet == null ? (
          <View />
        ) : isProfileSet ? (
          <MealLogScreenView />
        ) : (
          <DashboardScreen />
        )}
      </>
    );
  };
  return render();
};
