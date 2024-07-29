import type { Nutrient, NutrientType } from './Nutrient';

import type { ComputedWeight } from './ComputedWeight';
import type { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import type { ServingInfo } from './ServingInfo';

export interface FoodItem extends ServingInfo {
  name: string;
  iconId?: string;
  refCode: string;
  entityType: PassioIDEntityType | 'user-food';
  computedWeight: ComputedWeight;
  ingredientsDescription?: string;
  barcode?: string;
  nutrients: Nutrient[];
}

export function totalNutrientsOfFoodItems(
  foodItems: FoodItem[]
): Partial<Record<NutrientType, number>> {
  const nutrients: Partial<Record<NutrientType, number>> = {};
  for (const item of foodItems) {
    for (const { id, amount: amount } of item.nutrients) {
      const current = nutrients[id] ?? 0;
      nutrients[id] = current + amount;
    }
  }
  return nutrients;
}
