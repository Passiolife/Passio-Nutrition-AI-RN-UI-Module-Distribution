import {
  PassioAdvisorFoodInfo,
  PassioFoodItem,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import type { FoodLog, MealLabel } from '..';
import { getLogToDate, mealLabelByDate } from './ScaningUtils';
import {
  convertPassioFoodItemToFoodLog,
  updateQuantityOfFoodLog,
} from './V3Utils';

export const createFoodLogUsingFoodDataInfo = async (
  foods: PassioAdvisorFoodInfo[],
  date?: Date,
  mealLabel?: MealLabel
) => {
  const logToDate = getLogToDate(date, mealLabel);
  const meal = date === undefined ? mealLabelByDate(logToDate) : mealLabel;
  const foodLogs: FoodLog[] = [];

  for (const item of foods) {
    if (item && item.foodDataInfo) {
      const foodItem = await PassioSDK.fetchFoodItemForDataInfo(
        item.foodDataInfo
      );
      if (foodItem) {
        const foodLog = convertPassioFoodItemToFoodLog(
          foodItem,
          logToDate,
          meal
        );
        foodLogs.push(foodLog);
      }
    }
  }

  return foodLogs;
};

export const createFoodLogUsingPortionSize = (
  foodItem: PassioFoodItem,
  logToDate: Date,
  meal: MealLabel,
  weightGram: number,
  portionSize: string
) => {
  const [qty, unit] = portionSize.split(' ');

  const isNotIncludedUnit =
    foodItem?.amount.servingUnits?.filter(
      (i) => i.unitName?.toString() === unit?.toString()
    ).length === 0;

  let foodLog = convertPassioFoodItemToFoodLog(foodItem, logToDate, meal);

  if (isNotIncludedUnit) {
    const { computedWeight, foodItems } = foodLog;
    const servingWeight =
      computedWeight?.value ?? foodItems[0]?.computedWeight.value;
    const defaultWeight = servingWeight ?? 0;
    const newQuantity = Number(defaultWeight / Number(qty));
    foodLog.selectedQuantity = Number(
      newQuantity < 10 ? newQuantity.toFixed(2) : Math.round(newQuantity)
    );
    foodLog.selectedUnit = 'gram';
    foodLog = updateQuantityOfFoodLog(foodLog, weightGram);
    return foodLog;
  } else {
    return foodLog;
  }
};
