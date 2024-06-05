import { useEffect, useState } from 'react';
import { useServices } from '../contexts';
import type { NutritionTarget } from '../screens';
import { calculateTargetNutritionProfile } from '../screens';

export function useTargetMacros() {
  const services = useServices();
  const [nutritionTarget, setNutritionTarget] = useState<
    NutritionTarget | undefined
  >(undefined);

  useEffect(() => {
    const initData = async () => {
      const profile = await services.dataService.getNutritionProfile();
      setNutritionTarget(calculateTargetNutritionProfile(profile));
    };

    initData();
  }, [services.dataService]);

  return {
    targetCalories: nutritionTarget?.targetCalories ?? 0,
    targetFat: nutritionTarget?.targetFat ?? 0,
    targetCarbs: nutritionTarget?.targetCarbs ?? 0,
    targetProtein: nutritionTarget?.targetProtein ?? 0,
  };
}
