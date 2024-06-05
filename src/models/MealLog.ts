import type { PassioMealPlanItem } from '@passiolife/nutritionai-react-native-sdk-v3';
import type { FoodLog } from './FoodLog';

export interface MealLog {
  title: string;
  data: FoodLog[];
}

export interface MealPlan {
  title: string;
  data: PassioMealPlanItem[];
}
