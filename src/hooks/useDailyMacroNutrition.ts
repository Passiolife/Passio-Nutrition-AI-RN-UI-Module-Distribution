import { useEffect, useState } from 'react';
import { useServices } from '../contexts';
import type {
  DailyMacroNutrientAndCalories,
  NutritionTarget,
} from '../screens';
import {
  calculateDailyMacroNutrition,
  calculateTargetNutritionProfile,
} from '../screens';
import type { FoodLog, NutritionProfile } from '../models';
import { useNavigation } from '@react-navigation/native';
import type { ScreenNavigationProps } from '../navigaitons/HomeBottomNavigations';

export function useDailyMacroNutrition(foodLogs: FoodLog[]) {
  const services = useServices();
  const [dailyMacroNutrientAndCalories, setDailyMacroNutrientAndCalories] =
    useState<DailyMacroNutrientAndCalories | undefined>(undefined);
  const [nutritionTarget, setNutritionTarget] = useState<
    NutritionTarget | undefined
  >(undefined);
  const [profile, setProfile] = useState<NutritionProfile>();

  const navigation = useNavigation<ScreenNavigationProps>();

  useEffect(() => {
    const initData = async () => {
      const profileData = await services.dataService.getNutritionProfile();
      setDailyMacroNutrientAndCalories(
        calculateDailyMacroNutrition([...foodLogs])
      );
      setProfile(profileData);
      setNutritionTarget(calculateTargetNutritionProfile(profileData));
    };

    initData();
  }, [foodLogs, services.dataService]);

  const onReportPress = () => {
    navigation.navigate('BottomNavigation', {
      screen: 'ProgressScreen',
    });
  };

  return {
    dailyMacroNutrientAndCalories,
    nutritionTarget,
    onReportPress,
    profile,
  };
}
