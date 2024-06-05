import type { FoodItem, ServingUnit } from '../models/';
import {
  calculateComputedWeightAmount,
  totalAmountOfNutrient,
} from '../screens/editFoodLogs/utils';

export function shortLabel(label: string, limit: number): string {
  return label.length > limit
    ? `${label.substring(0, limit)}...`
    : label.substring(0, limit);
}

export function servingLabel({
  selectedQuantity,
  servingUnits,
  selectedUnit,
}: {
  selectedQuantity: number;
  servingUnits: ServingUnit[];
  selectedUnit: string;
}): string {
  let weight = calculateComputedWeightAmount(
    selectedQuantity,
    servingUnits,
    selectedUnit
  );
  weight = weight > 1 ? Math.floor(weight) : weight;
  return `${selectedQuantity} ${selectedUnit} (${weight} ${'g'})`;
}

export function caloriesText(
  foodItems: FoodItem[],
  text: string = 'g'
): string {
  let calorieText = '';
  let calorie: number | undefined = totalAmountOfNutrient(
    foodItems,
    'calories'
  );
  if (calorie !== undefined) {
    calorieText = `${calorie.toFixed(0)} ${text}`;
  }
  return calorieText;
}

export function caloriesTextForFoodItem(
  foodItem: FoodItem,
  text: string = 'g'
): string {
  let caloriesTextOutput = '';
  let calorie: number | undefined = totalAmountOfNutrient(
    [foodItem],
    'calories'
  );
  if (calorie !== undefined) {
    caloriesTextOutput = `${calorie.toFixed(0)} ${text === 'calories' ? 'c' : text}`;
  }
  return caloriesTextOutput;
}
