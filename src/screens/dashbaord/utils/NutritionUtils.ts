import type { FoodLog } from '../../../models';
import { totalAmountOfNutrient } from '../../editFoodLogs';
import type { NutritionProfile } from '../../../models';

export interface DailyMacroNutrientAndCalories {
  amountOfCalories: number;
  amountOfCarbs: number;
  amountOfProtein: number;
  amountOfFat: number;
}
export const calculateDailyMacroNutrition = (
  logs: FoodLog[]
): DailyMacroNutrientAndCalories => {
  let totalCalories = 0;
  let totalCarbs = 0;
  let totalProtein = 0;
  let totalFat = 0;

  logs.forEach((value) => {
    totalCalories =
      totalCalories + totalAmountOfNutrient(value.foodItems, 'calories');
    totalCarbs = totalCarbs + totalAmountOfNutrient(value.foodItems, 'carbs');
    totalProtein =
      totalProtein + totalAmountOfNutrient(value.foodItems, 'protein');
    totalFat = totalFat + totalAmountOfNutrient(value.foodItems, 'fat');
  });
  return {
    amountOfCalories: totalCalories,
    amountOfCarbs: totalCarbs,
    amountOfProtein: totalProtein,
    amountOfFat: totalFat,
  };
};

export interface NutritionTarget {
  targetCalories: number;
  targetCarbs: number;
  targetProtein: number;
  targetFat: number;
}

export const calculateTargetNutritionProfile = (
  profile: NutritionProfile | undefined
): NutritionTarget => {
  let targetCalories = 0;
  let targetCarbs = 0;
  let targetProtein = 0;
  let targetFat = 0;

  if (profile !== undefined) {
    targetCalories = profile.caloriesTarget;
    targetCarbs = (targetCalories * profile.carbsPercentage) / 100 / 4;
    targetFat = (targetCalories * profile.fatPercentage) / 100 / 9;
    targetProtein = (targetCalories * profile.proteinPercentage) / 100 / 4;
  }

  return {
    targetCalories: targetCalories,
    targetCarbs: Math.round(targetCarbs),
    targetProtein: Math.round(targetProtein),
    targetFat: Math.round(targetFat),
  };
};

export function caloriesText(foodLog: FoodLog, text: string = 'g'): string {
  let calorieText = '';
  let calorie: number | undefined = totalAmountOfNutrient(
    foodLog.foodItems,
    'calories'
  );
  if (calorie !== undefined) {
    calorieText = `${calorie.toFixed(0)} ${text}`;
  }
  return calorieText;
}
