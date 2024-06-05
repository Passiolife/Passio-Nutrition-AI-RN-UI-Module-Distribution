import type { UnitSystem } from './UnitSystem';
import type { ActivityLevelType, CaloriesDeficit } from './ActivityLevel';
import type { DietType } from './DietType';
export type GenderType = 'male' | 'female';
export interface NutritionProfile {
  caloriesTarget: number;
  carbsPercentage: number;
  proteinPercentage: number;
  fatPercentage: number;
  unitLength: UnitSystem;
  unitsWeight: UnitSystem;
  gender: 'male' | 'female';
  height: number;
  age: number;
  weight: number;
  activityLevel: ActivityLevelType;
  diet?: DietType;
  name: string;
  caloriesDeficit?: CaloriesDeficit;
  targetWater?: number;
  targetWeight?: number;
  breakFastNotification?: boolean;
  dinnerNotification?: boolean;
  lunchNotification?: boolean;
  mealPlan?: string;
}
