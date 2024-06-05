import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { AsyncStorageHelper } from '../../../utils/AsyncStorageHelper';
import { OnBoardingCard } from './OnBoardingCard';
import NutritionProgressCard from './NutritionProgressCard';

export const NutritionTrackerDashboardCard = () => {
  const isFocused = useIsFocused();
  const [hasCompletedOnboarding, setHasCompletedOnBoarding] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    async function init() {
      setHasCompletedOnBoarding(
        await AsyncStorageHelper.checkOnBoardingCompleted()
      );
    }

    init();
  }, [isFocused]);

  return (
    <View>
      {hasCompletedOnboarding === null ? (
        <View testID={'tesViewBlank'} />
      ) : !hasCompletedOnboarding ? (
        <OnBoardingCard />
      ) : (
        <NutritionProgressCard />
      )}
    </View>
  );
};
