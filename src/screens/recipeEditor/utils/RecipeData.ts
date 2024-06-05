import type { FoodItem, NutrientType, Recipe } from '../../../models';

import type { PassioID } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { totalAmountOfNutrient } from '../../editFoodLogs';

export function addUpdateRecipe(
  uuId: string,
  recipe: Recipe,
  recipes: Recipe[]
): Recipe[] {
  return [...recipes.filter((o) => o.uuid !== uuId), { ...recipe }];
}

export const deleteRecipe = (uuId: string, recipes: Recipe[]): Recipe[] => {
  return recipes.filter((value) => value.uuid !== uuId);
};
export const addOrUpdateIngredients = (
  passioID: PassioID,
  foodItem: FoodItem,
  foodItems: FoodItem[]
): FoodItem[] => {
  return [...foodItems.filter((o) => o.passioID !== passioID), { ...foodItem }];
};
export const deleteIngredient = (
  passioID: PassioID,
  foodItems: FoodItem[]
): FoodItem[] => {
  return foodItems.filter((value) => value.passioID !== passioID);
};
export const macroPerService = (
  foodItems: FoodItem[],
  type: NutrientType,
  totalServings: number
): number => {
  if (foodItems.length > 0 && totalServings > 0) {
    return totalAmountOfNutrient(foodItems, type) / totalServings;
  } else {
    return 0;
  }
};
